# Wallet connection review response — 30 September 2026

## Why the earlier connection was limited

The previous frontend requested accounts directly from `window.ethereum`, then asked that one provider to add/switch networks through the GenLayer SDK. It provided no wallet selection UI, EIP-6963 multi-wallet discovery, WalletConnect QR flow or explicit disconnect control. A browser without an injected wallet could not connect.

## Source changes

- Pinned RainbowKit `2.2.11`, Wagmi `2.19.5`, Viem `2.57.1`, and TanStack Query `5.104.0`. Updated Next.js and its ESLint configuration to `16.3.8` after the dependency audit found a critical advisory in the previous Next.js version.
- Added RainbowKit's wallet-selection, account and chain-switch modals, with a visible disconnect control.
- When no extension is present and mobile pairing is unconfigured, the interface shows a clear no-wallet state instead of leaving the picker waiting for an extension.
- Enabled EIP-6963 discovery so compatible installed wallets can be selected independently.
- Configured StudioNet as chain `61999`, using the existing GenLayer SDK's RPC and simulated GEN currency metadata.
- The signing adapter uses the selected Wagmi connector's EIP-1193 provider, not a global wallet guess. It verifies account, chain and current session before signing; invalidated connections fail closed.
- The wallet interface loads in a browser-only shell. The existing Vinext app returned a server render error when the wallet providers were mounted in the root layout; the browser shell keeps the route available while the wallet UI initializes.
- Keeps wallet-free reads, exact-value transaction submission, pending-hash recovery, and explicit finalized execution checks.
- Public source/reviewer links now target this dedicated SponsorProof repository.

## Local verification

- TypeScript check passed.
- 27 tests passed, including selected-provider account and network checks, session invalidation, real StudioNet success and rollback receipts, and existing transaction/amount checks.
- The local page returned HTTP 200, showed both existing agreements, and opened the RainbowKit wallet picker. A real extension-wallet signature and mobile pairing remain to be checked after configuration.
- The runtime dependency audit now reports 23 moderate advisories and no high or critical findings. The remaining moderate items are in the dependency tree and are not resolved by the compatible pinned wallet versions in this change.

## Required owner configuration

WalletConnect QR/mobile support is conditional on an owner-provided Reown project ID. Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` to the project's public 32-character identifier before building. This is not a private key. Allow the exact replacement production origin `https://sponsorproof-studionet-wallet.esuspsychic.chatgpt.site` in the project's origin settings; add localhost separately only for development.

Without a valid identifier, the app enables injected wallets only and visibly explains the limitation. It does not initialize WalletConnect with a placeholder or someone else's ID. No support for every possible wallet or every custom-chain capability is claimed.

RainbowKit setup: https://rainbowkit.com/docs/installation

## Publication status

**Published at the replacement URL:** https://sponsorproof-studionet-wallet.esuspsychic.chatgpt.site/. The original Site ID is inaccessible from the current account. New public SponsorProof Site `appgprj_6abd3cd265288191a45c1a6fa11e4122` deployed source version 2 from commit `d4955f0763234e13af6b691e16a9797dcec1af8d` on 30 September 2026. Version 2 corrects the app metadata and submission links to the actual published origin. See `deployments/sponsorproof_wallet_site.json` for the deployment identifiers. The original Site URL did not receive this update. The live contract and existing demo records are unchanged.

The public page and agreement reads were verified at the new URL. Final wallet acceptance should include a real extension-wallet connection, account/network switching, disconnect/reconnect, and (once configured) a WalletConnect mobile connection on StudioNet. These checks should not require transferring funds.
