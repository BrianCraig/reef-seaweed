import { BigNumber } from "@ethersproject/bignumber";

export interface IPFSMultihash {
  digest: string;
  hashFunction: number;
  size: number;
}

export interface IDORange {
  start: BigNumber;
  end: BigNumber;
}

export interface Multiplier {
  multiplier: number;
  divider: number;
}

export interface IDOParams {
  approved: boolean;
  token: string;
  multiplier: Multiplier;
  ipfs: IPFSMultihash;
  open: IDORange;
  minimumLockedAmount: BigNumber;
  baseAmount: BigNumber;
  maxAmountPerAddress: BigNumber;
  totalBought: BigNumber;
}

export interface IDO {
  params: IDOParams;
  owner: string;
  paidToOwner: BigNumber;
  id?: number;
}

export interface Vesting {
  beneficiary: string;
  amount: BigNumber;
  timestamp: BigNumber;
  claimed: boolean;
}