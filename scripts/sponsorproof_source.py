"""Source-verification helpers extracted from the original shared deploy script."""
import base64
import hashlib
from eth_utils import to_checksum_address


def _source_digest(code: str) -> str:
    return hashlib.sha256(code.replace("\r\n", "\n").encode("utf-8")).hexdigest()


def _extract_contract_address(receipt: dict) -> str:
    for key in ("tx_data_decoded", "data"):
        value = receipt.get(key)
        if isinstance(value, dict) and value.get("contract_address"):
            return to_checksum_address(value["contract_address"])
    raise RuntimeError("Finalized deployment receipt is missing its contract address")


def _verify_source(client, address: str, expected_code: str) -> str:
    response = client.provider.make_request(method="gen_getContractCode", params=[address])
    encoded = response.get("result")
    if not isinstance(encoded, str):
        raise RuntimeError("Could not retrieve deployed contract source")
    try:
        deployed_code = base64.b64decode(encoded, validate=True).decode("utf-8")
    except (ValueError, UnicodeError):
        raise RuntimeError("Deployed source was not valid encoded Python") from None
    expected_digest = _source_digest(expected_code)
    if _source_digest(deployed_code) != expected_digest:
        raise RuntimeError("Deployed source does not match the linted local contract")
    return expected_digest
