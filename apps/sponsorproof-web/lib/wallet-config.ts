import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { injectedWallet, metaMaskWallet, rainbowWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { chains } from "genlayer-js";
import { walletConnectProjectId } from "./wallet-settings";

export const studioChain = {
  id: chains.studionet.id,
  name: "GenLayer StudioNet",
  nativeCurrency: chains.studionet.nativeCurrency,
  rpcUrls: chains.studionet.rpcUrls,
  blockExplorers: { default: { name: "StudioNet Explorer", url: "https://explorer-studio.genlayer.com" } },
  testnet: true,
} as const;

export const projectId = walletConnectProjectId(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);
export const mobileWalletsEnabled = Boolean(projectId);

export function makeWalletConfig() {
  // The injected connector needs no project ID. Never initialize a relay with a fake ID.
  const wallets = projectId ? [injectedWallet, metaMaskWallet, rainbowWallet, walletConnectWallet] : [injectedWallet];
  return createConfig({
    chains: [studioChain],
    connectors: connectorsForWallets([{ groupName: "Connect a wallet", wallets }], {
      appName: "SponsorProof", projectId: projectId ?? "",
      appUrl: "https://sponsorproof-studionet-wallet.prime-cake-6919.chatgpt.site",
    }),
    multiInjectedProviderDiscovery: true,
    ssr: true,
    transports: { [studioChain.id]: http(studioChain.rpcUrls.default.http[0], { retryCount: 1 }) },
  });
}
