"""Explicit opt-in signer for optional write-based demonstrations only."""
import os


def _load_signer() -> str:
    value = os.environ.get("SPONSORPROOF_DEMO_PRIVATE_KEY", "").strip()
    if not value:
        raise RuntimeError(
            "Seeding submits StudioNet transactions. Set SPONSORPROOF_DEMO_PRIVATE_KEY "
            "explicitly only for an authorized demo; read-only verification needs no key."
        )
    return value
