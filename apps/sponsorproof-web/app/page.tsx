"use client";

import dynamic from "next/dynamic";

const SponsorProofShell = dynamic(() => import("@/components/sponsorproof-shell"), {
  ssr: false,
  loading: () => <main className="workspace"><p>Opening SponsorProof…</p></main>,
});

export default function Home() { return <SponsorProofShell />; }
