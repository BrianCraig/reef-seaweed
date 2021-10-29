import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
  status?: IDOStatus,
  wei: BigNumber,
  setWei: React.Dispatch<React.SetStateAction<BigNumber>>
  onBuy: () => any,
  onWithdraw: () => any,
  balance: BigNumber
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
  wei: BigNumber.from(0),
  setWei: () => { },
  onBuy: () => { },
  onWithdraw: () => { },
  balance: BigNumber.from(0)
});

export const IDOContextProvider: React.FunctionComponent<{ address: string }> = ({ children, address }) => {
  const { selectedSigner } = useContext(AccountsContext);
  const [wei, setWei] = useState<BigNumber>(BigNumber.from(0));
  let contract = selectedSigner ? IIDO(address).connect(selectedSigner.signer as any) : undefined;
  const { execute: informationExecute, status: informationStatus, value: information } = useAsync<any>(() => contract!.information(), false);
  const { execute: balanceExecute, status: balanceStatus, value: balanceValue } = useAsync<any>(() => contract!.boughtAmount(selectedSigner!.evmAddress), false);

  useEffect(() => {
    if (selectedSigner && informationStatus === "idle") {
      informationExecute();
    }
  }, [informationStatus, selectedSigner, informationExecute])

  let onBuy = useCallback(async () => {
    await contract!.buy(wei, { value: wei })
    balanceExecute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, wei])

  let onWithdraw = useCallback(async () => {
    await contract!.withdraw(wei);
    balanceExecute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, wei])

  useEffect(() => {
    if (selectedSigner && balanceStatus === "idle") {
      balanceExecute();
    }
  }, [selectedSigner, balanceStatus, balanceExecute])
  useIntervalUpdate();

  const status = information ? timestampToStatus((information as InformationInterface)) : undefined;
  const value = useMemo(() => ({
    information: (information as InformationInterface),
    status,
    wei,
    setWei,
    onBuy,
    onWithdraw,
    balance: balanceValue || BigNumber.from(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [information, status, wei, setWei, balanceValue])

  return <IDOContext.Provider value={value}>
    {information?.tokenAddress ? <TokenContextProvider address={information.tokenAddress} children={children} /> : children}
  </IDOContext.Provider >
}