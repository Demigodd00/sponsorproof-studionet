# SponsorProof source provenance

This repository isolates SponsorProof so its project submission has a dedicated repository rather than a GitHub URL shared with unrelated applications. It does not claim a new release, new users, a new deployment or a new contribution solely from repackaging.

## Original public history

- Original repository: https://github.com/Demigodd00/demigodd00-genlayer-apps
- Exported snapshot: [81fae559885d61d6abb96ed5100255ef052bddc6](https://github.com/Demigodd00/demigodd00-genlayer-apps/commit/81fae559885d61d6abb96ed5100255ef052bddc6)
- Initial SponsorProof implementation: [3e76611a2467af1c9f518a7d8f2669b3a1625636](https://github.com/Demigodd00/demigodd00-genlayer-apps/commit/3e76611a2467af1c9f518a7d8f2669b3a1625636)
- Receipt-handling fix: [8dc61065404ba9d962de37010cb322f9bde74269](https://github.com/Demigodd00/demigodd00-genlayer-apps/commit/8dc61065404ba9d962de37010cb322f9bde74269)

The original commit graph remains available there. This repository starts with an explicitly attributed source snapshot rather than manufacturing a replacement development history.

## Unchanged deployed release

- Network: GenLayer StudioNet.
- Contract: `0x0235c7f7E646bA26532587aFED3108148C92Ef2f`.
- Contract source SHA-256 (UTF-8, LF): `9c1798d53296836efc5f65ff70d0c90c13c38ad5aeba86060414a3d9dab5dd87`.
- Public app: https://sponsorproof-studionet.blazekingsley2.chatgpt.site/
- Both demo journals and all frozen evidence-source URLs are preserved verbatim. Moving an agreed URL would change its provenance; no such migration was performed.

## Packaging-only adjustments

- Included only SponsorProof source, tests, public evidence and required supporting files.
- Omitted unrelated apps, local environment files, private signing material, build outputs, dependencies and local hosting connection metadata.
- Extracted the common source-verification functions into `scripts/sponsorproof_source.py`; the StudioNet read adapter remains unchanged under its historical filename.
- Updated the deployment script and integration test imports to the standalone source helper.
- Replaced the historical cross-project signer loader with an explicit environment-only `SPONSORPROOF_DEMO_PRIVATE_KEY` loader. It never silently borrows another project's wallet. Existing demo journals cannot be resumed with a different signer.
- Added a focused README, submission links and the PNG export of the existing app icon. Reviewer document links use this repository; historical evidence URLs and frontend links stay unchanged.

No deployed contract logic, historical evidence, transaction outcome or production website was changed by this extraction.
