import test from 'node:test';
import assert from 'node:assert/strict';
import { chains } from 'genlayer-js';
import { checkWallet, walletFromProvider } from '../lib/sponsorproof.ts';
import { walletConnectProjectId } from '../lib/wallet-settings.ts';

const account = '0x1111111111111111111111111111111111111111';
const other = '0x2222222222222222222222222222222222222222';
const chain = `0x${chains.studionet.id.toString(16)}`;
function provider(accounts = [account], network = chain) {
  const calls = [];
  return { calls, async request({ method }) {
    calls.push(method);
    if (method === 'eth_accounts') return accounts;
    if (method === 'eth_chainId') return network;
    if (method === 'personal_sign') return '0x1234';
    throw new Error(`Unexpected provider call: ${method}`);
  } };
}

test('selected connector works without window.ethereum and never requests accounts twice', async () => {
  const selected = provider();
  const wallet = await walletFromProvider(selected, account);
  assert.equal(wallet.provider, selected);
  assert.equal(wallet.address, account);
  assert.deepEqual(selected.calls, ['eth_accounts', 'eth_chainId']);
});

test('account mismatch and locked wallets cannot become signing sessions', async () => {
  await assert.rejects(walletFromProvider(provider([other]), account), /Wallet changed/);
  await assert.rejects(walletFromProvider(provider([]), account), /Wallet changed/);
});

test('wrong network and invalid chain responses are blocked', async () => {
  await assert.rejects(walletFromProvider(provider([account], '0x1'), account), /Switch to GenLayer/);
  await assert.rejects(walletFromProvider(provider([account], 'unknown'), account), /invalid network/);
});

test('missing provider and malformed addresses produce useful errors', async () => {
  await assert.rejects(walletFromProvider(undefined, account), /selected wallet/);
  await assert.rejects(walletFromProvider(provider(), 'not-an-address'), /valid wallet/);
});

test('a session invalidated during connection cannot become active', async () => {
  let active = true;
  const selected = provider();
  const request = selected.request;
  selected.request = async input => {
    const result = await request(input);
    if (input.method === 'eth_chainId') active = false;
    return result;
  };
  await assert.rejects(walletFromProvider(selected, account, () => active), /session changed/);
});

test('disconnect invalidates old sessions and blocks subsequent signature requests', async () => {
  let active = true;
  const selected = provider();
  const wallet = await walletFromProvider(selected, account, () => active);
  active = false;
  await assert.rejects(checkWallet(wallet), /session changed/);
  await assert.rejects(wallet.client.request({ method: 'personal_sign', params: ['0x00', account] }), /session changed/);
  assert.equal(selected.calls.includes('personal_sign'), false);
});

test('account changes are checked again immediately before signing', async () => {
  const accounts = [account];
  const selected = provider(accounts);
  const wallet = await walletFromProvider(selected, account);
  accounts[0] = other;
  await assert.rejects(wallet.client.request({ method: 'personal_sign', params: ['0x00', account] }), /Wallet changed/);
  assert.equal(selected.calls.includes('personal_sign'), false);
});

test('wallet rejection is propagated, not reported as connected', async () => {
  const rejected = { request: async () => { throw Object.assign(new Error('User rejected connection'), { code: 4001 }); } };
  await assert.rejects(walletFromProvider(rejected, account), /User rejected/);
});

test('WalletConnect is disabled for absent, placeholder and zero IDs', () => {
  for (const input of [undefined, '', 'YOUR_PROJECT_ID', '0'.repeat(32), 'short']) {
    assert.equal(walletConnectProjectId(input), undefined);
  }
  assert.equal(walletConnectProjectId('  ' + 'a1'.repeat(16) + '  '), 'a1'.repeat(16));
});
