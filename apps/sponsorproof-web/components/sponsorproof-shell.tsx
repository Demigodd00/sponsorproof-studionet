"use client";

import SponsorProofApp from "@/components/sponsorproof-app";
import { WalletProvider } from "@/components/wallet-provider";

export default function SponsorProofShell() {
  return <WalletProvider><SponsorProofApp /></WalletProvider>;
}
