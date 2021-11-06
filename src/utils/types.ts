
import { Signer } from '@reef-defi/evm-provider';
import { BigNumber } from 'ethers';

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

export interface PublishValues {
  tokenName: string;
  tokenSymbol: string;
  reefAmount: number;
  reefMultiplier: number;
  reefMaxPerAddress: number;
  swdWhitelisting: number;
  start: string;
  end: string;
}

export enum IDOStatus {
  Pending,
  Open,
  Ended
}

export interface InformationInterface {
  tokenAddress: string
  multiplier: number
  divider: number
  startingTimestamp: BigNumber
  endTimestamp: BigNumber
  fulfilled: boolean
  maxSoldBaseAmount: BigNumber
  ipfsDigest: string
  ipfsHashFunction: number
  ipfsSize: number
}

export interface FullIDOInfo { address: string, info: InformationInterface }

export interface IPFSIDO {
  title: string,
  subtitle: string,
  description: string,
  logo: string,
  background: string
}

export interface VestingForm {
  beneficiary: string;
  amount: number;
  timestamp: string;
}