# Standalone repository verification

The dedicated repository is a packaging change, not a new deployment.

Checks run from `sponsorproof-studionet`, independently of the original repository's Python imports:

- `pytest tests/direct/test_sponsorproof.py -v`: **32 passed**.
- `pytest tests/integration/test_sponsorproof_studionet.py -v -s`: **2 passed**. These read existing StudioNet state and receipts; no transactions were submitted.
- Original frontend, contract and both demo journals were compared to the attributed source snapshot. Their content is unchanged. Text files use LF line endings, matching the original Git objects.
- Contract source SHA-256: `9c1798d53296836efc5f65ff70d0c90c13c38ad5aeba86060414a3d9dab5dd87`.
- The staged file set excludes environment files, signing keys, local hosting connection metadata, dependency folders, generated build output and unrelated applications. A common credential-pattern scan found no matches; this is not an exhaustive security audit.

The frontend itself was not changed by packaging. The preceding application review passed 18 frontend tests and TypeScript checking, and exercised the public wallet-free demonstration. A fresh dependency installation/build was not repeated for this extraction.

The contribution portal's duplicate-URL validation cannot be verified here. This repository replaces the previously shared GitHub URL; an existing contribution or a different conflicting URL may still require portal-side action.
