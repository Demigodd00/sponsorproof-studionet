"use client";

import { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { mobileWalletsEnabled, studioChain } from "@/lib/wallet-config";
import { walletFromProvider, errorText, type Provider, type Wallet } from "@/lib/sponsorproof";

export function useSponsorWallet() {
  const { address, chainId, connector, status } = useAccount();
  const key = status === "connected" && address && chainId === studioChain.id ? `${connector?.uid}:${address.toLowerCase()}:${chainId}` : "";
  const current = useRef(key);
  current.current = key;
  const [binding, setBinding] = useState<{ key: string; wallet: Wallet } | null>(null);
  const [error, setError] = useState<{ key: string; text: string } | null>(null);
  useEffect(() => {
    let active = true;
    setBinding(null);
    setError(null);
    if (!key || !connector || !address) return;
    void connector.getProvider().then(async provider => {
      const wallet = await walletFromProvider(provider as Provider, address, () => active && current.current === key);
      if (active && current.current === key) setBinding({ key, wallet });
    }).catch(reason => { if (active && current.current === key) setError({ key, text: errorText(reason) }); });
    return () => { active = false; };
  }, [key, connector, address]);
  return {
    wallet: key && binding?.key === key ? binding.wallet : null,
    walletError: key && error?.key === key ? error.text : "",
    status,
    wrongChain: status === "connected" && chainId !== studioChain.id,
    preparing: Boolean(key && binding?.key !== key && error?.key !== key),
  };
}

export function WalletControls({ disabled }: { disabled: boolean }) {
  const { disconnect, isPending } = useDisconnect();
  const [browserWalletFound, setBrowserWalletFound] = useState<boolean | null>(null);
  useEffect(() => {
    const checkInjected = () => setBrowserWalletFound(Boolean((window as Window & { ethereum?: unknown }).ethereum));
    const onAnnounce = () => setBrowserWalletFound(true);
    window.addEventListener("ethereum#initialized", checkInjected);
    window.addEventListener("eip6963:announceProvider", onAnnounce);
    checkInjected();
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return () => {
      window.removeEventListener("ethereum#initialized", checkInjected);
      window.removeEventListener("eip6963:announceProvider", onAnnounce);
    };
  }, []);
  return <ConnectButton.Custom>{({ mounted, account, chain, openConnectModal, openAccountModal, openChainModal }) => {
    if (!mounted) return <Button disabled variant="outline">Loading wallets…</Button>;
    if (!account || !chain) {
      if (!mobileWalletsEnabled && browserWalletFound === false) return <Button disabled variant="outline">No wallet extension found</Button>;
      return <Button disabled={disabled} onClick={openConnectModal}>Connect wallet</Button>;
    }
    return <>
      {chain.unsupported && <Button disabled={disabled} onClick={openChainModal}>Switch to StudioNet</Button>}
      <Button variant="outline" disabled={disabled} onClick={openAccountModal}>{account.displayName}</Button>
      <Button variant="ghost" disabled={disabled || isPending} onClick={() => disconnect()}>Disconnect</Button>
    </>;
  }}</ConnectButton.Custom>;
}

export function WalletHelp() {
  return <p className="wallet-help">Viewing needs no wallet. Use an Ethereum-compatible wallet that supports custom networks.
    {!mobileWalletsEnabled && <> Mobile QR connections are not configured yet. Install a desktop wallet extension or open this page in a wallet-enabled browser.</>}
  </p>;
}
