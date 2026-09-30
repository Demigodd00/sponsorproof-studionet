"use client";

import { useState } from "react";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { makeWalletConfig, studioChain } from "@/lib/wallet-config";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [config] = useState(makeWalletConfig);
  const [queries] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } }));
  return <WagmiProvider config={config}><QueryClientProvider client={queries}>
    <RainbowKitProvider initialChain={studioChain} modalSize="compact" theme={lightTheme({ accentColor: "#244eed", borderRadius: "medium" })}>
      {children}
    </RainbowKitProvider>
  </QueryClientProvider></WagmiProvider>;
}
