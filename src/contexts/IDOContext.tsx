import React, { useContext, useEffect, useMemo } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { IIDO } from '../abis/contracts';
import { useAsync, useIntervalUpdate } from '../utils/hooks';
import { AccountsContext } from './AccountsContext';
import { TokenContextProvider } from './TokenContext';

export enum IDOStatus {
  Pending,
  Open,
  Ended
}

export interface InformationInterface {
  tokenAddress: string
  multiplier: BigNumber
  divider: BigNumber
  ipfs: BigNumber
  startingTimestamp: BigNumber
  endTimestamp: BigNumber
  fulfilled: boolean
  maxSoldBaseAmount: BigNumber
}

interface IDOContextInterface {
  information?: InformationInterface
  status?: IDOStatus
}

const timestampToStatus = ({ startingTimestamp, endTimestamp }: InformationInterface): IDOStatus => {
  let start = startingTimestamp.toNumber();
  let end = endTimestamp.toNumber();
  let timestampNow = Math.floor(Date.now() / 1000);
  if (timestampNow < start) return IDOStatus.Pending;
  if (timestampNow < end) return IDOStatus.Open;
  return IDOStatus.Ended;
}

export const IDOContext = React.createContext<IDOContextInterface>({
});

export const IDOContextProvider: React.FunctionComponent<{ address: string }> = ({ children, address }) => {
  const { selectedSigner } = useContext(AccountsContext);
  let contract = selectedSigner ? IIDO(address).connect(selectedSigner.signer as any) : undefined;
  const { execute: informationExecute, status: informationStatus, value: information } = useAsync<any>(() => contract!.information(), false);

  useEffect(() => {
    if (selectedSigner && informationStatus === "idle") {
      informationExecute();
    }
  }, [informationStatus, selectedSigner, informationExecute])

  useIntervalUpdate();

  const status = information ? timestampToStatus((information as InformationInterface)) : undefined;
  const value = useMemo(() => ({
    information: (information as InformationInterface),
    status
  }), [information, status])

  return <IDOContext.Provider value={value}>
    {information?.tokenAddress ? <TokenContextProvider address={information.tokenAddress} children={children} /> : children}
  </IDOContext.Provider >
}