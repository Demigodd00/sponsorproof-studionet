// This identifier is public configuration, never a wallet key or API secret.
export function walletConnectProjectId(value: string | undefined): string | undefined {
  const id = value?.trim();
  return id && /^[a-f0-9]{32}$/i.test(id) && !/^0{32}$/.test(id) ? id : undefined;
}

