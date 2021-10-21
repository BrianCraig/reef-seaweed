
import { Signer } from '@reef-defi/evm-provider';

export interface Keypair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}
export interface Seedpair {
  publicKey: Uint8Array;
  seed: Uint8Array;
}
export declare type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum';
export interface VerifyResult {
  crypto: 'none' | KeypairType;
  isValid: boolean;
  publicKey: Uint8Array;
}
export interface InjectedAccount {
  address: string;
  genesisHash?: string | null;
  name?: string;
  type?: KeypairType;
}
export interface InjectedAccountWithMeta {
  address: string;
  meta: {
    genesisHash?: string | null;
    name?: string;
    source: string;
  };
  type?: KeypairType;
}

export interface AccountSigner {
  signer: Signer;
  name: string;
  address: string;
  evmAddress: string;
  isEvmClaimed: boolean;
}