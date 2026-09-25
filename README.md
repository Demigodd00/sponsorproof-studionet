# SponsorProof

GenLayer-native sponsorship fulfillment, evidence review and settlement on StudioNet.

[Live app](https://sponsorproof-studionet.blazekingsley2.chatgpt.site/) · [Reviewer guide](docs/SPONSORPROOF_REVIEW.md) · [Contract](https://explorer-studio.genlayer.com/address/0x0235c7f7E646bA26532587aFED3108148C92Ef2f) · [Submission links](docs/SUBMISSION.md)

Sponsors and organizers agree on plain-English commitments, exact public evidence URLs, payment weights and deadlines. The contract freezes wallet-bound publication evidence, obtains independently verified AI judgments and computes allocations in deterministic code. Shared appeals, immutable decision history and pull-based claims complete the workflow.

## Verify the working demonstration

Open the app without a wallet and select **sp-2 — Open Builders Workshop · bilateral appeal demo**. Both parties' appeal statements were accepted within the common window. The agreement is **SETTLED**, with **0.00065 simulated GEN** allocated to the organizer, **0.00035 simulated GEN** to the sponsor and **0** held. Both claims executed and remaining claim credits are zero.

The [bilateral run journal](deployments/sponsorproof_bilateral_demo.json) preserves transaction hashes and state snapshots. The [original run](deployments/sponsorproof_demo.json) remains unchanged, including its correctly rejected late sponsor appeal. These are controlled fixtures, not external adoption.

## Source layout

- `contracts/sponsorproof.py`: the exact deployed intelligent contract.
- `apps/sponsorproof-web/`: complete frontend source and locked dependencies.
- `tests/direct/`: deterministic contract tests with controlled web/LLM responses.
- `tests/integration/`: read-only verification of both actual StudioNet demo records.
- `deployments/`: deployment records and immutable historical evidence journals.
- `docs/`: reviewer instructions, design boundaries, fixtures and submission logo.

## Reproduce verification

Use Python 3.12 and Node 24. From the repository root:

```sh
python -m pip install -r requirements-deploy.txt
python scripts/prepare_gltest_runner.py
pytest tests/direct/test_sponsorproof.py -v
pytest tests/integration/test_sponsorproof_studionet.py -v -s
```

The integration tests only read existing state and finalized execution receipts. They do not submit transactions or need a private key. Direct tests use controlled responses; they do not establish live consensus.

```sh
cd apps/sponsorproof-web
npm ci
npx tsc --noEmit --incremental false
node --experimental-strip-types --test tests/protocol.test.mjs tests/receipts.test.mjs tests/receipts.live.test.mjs
npm run build
```

`npm run dev` starts the local UI. No application API secret is needed for public contract reads. Signing requires an injected StudioNet wallet. Do not run the deployment or seeding scripts merely to verify the published demo: those scripts can submit transactions. Existing journals are historical records, not templates to reset or overwrite.

## Important boundaries

- StudioNet GEN is simulated; this is not production custody or real-money readiness.
- Public text/HTML evidence and publication challenges establish limited source-control provenance, not factual truth, audience reach, originality or human identity.
- Evidence and agreement text are public. Never provide secrets or private information.
- Network and model availability may affect new transactions. Finality alone is not execution success.
- The latest full dependency audit has six low/moderate development-tool findings; the runtime-only audit reported none. This is not a security certification.

## Repository provenance

This is a focused extraction of SponsorProof from the existing [GenLayer apps repository](https://github.com/Demigodd00/demigodd00-genlayer-apps), not a new deployment or a claim of new implementation work. Original history, source commit links, packaging changes and exact-source hash are documented in [PROVENANCE.md](PROVENANCE.md). The original repository, live website, deployed contract and evidence-source URLs remain intact.
