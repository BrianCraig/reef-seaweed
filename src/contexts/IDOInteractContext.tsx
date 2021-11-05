import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { IIDO } from '../abis/contracts';
import { useAsync, useIntervalUpdate } from '../utils/hooks';
import { AccountsContext } from './AccountsContext';
import { TokenContextProvider } from './TokenContext';
import { IDOStatus } from '../utils/types';
import { rangeToStatus } from '../utils/utils';
import { IDOContext } from './IDOContext';
import { NetworkContext } from './NetworkContext';

interface IDOInteractContextInterface {
  status?: IDOStatus,
  wei: BigNumber,
  setWei: React.Dispatch<React.SetStateAction<BigNumber>>
  onBuy: () => any,
  onWithdraw: () => any,
  onGetPayout: () => any,
  balance: BigNumber,
  paid: boolean
}

export const IDOInteractContext = React.createContext<IDOInteractContextInterface>({
  wei: BigNumber.from(0),
  setWei: () => { },
  onBuy: () => { },
  onWithdraw: () => { },
  onGetPayout: () => { },
  balance: BigNumber.from(0),
  paid: false
});


export const IDOInteractContextProvider: React.FunctionComponent = ({ children }) => {
  const { network: { SeaweedAddress } } = useContext(NetworkContext)
  const { IDO } = useContext(IDOContext);
  const { signer, evmAddress } = useContext(AccountsContext);
  const [wei, setWei] = useState<BigNumber>(BigNumber.from(0));
  let contract = signer ? IIDO(SeaweedAddress, signer) : undefined;
  const { execute: balanceExecute, value: balanceValue } = useAsync<any>(() => contract!.boughtAmount(IDO.id, evmAddress), false);
  const { execute: paidExecute, value: paidValue } = useAsync<boolean>(() => contract!.beenPaid(IDO.id, evmAddress), false);

  let onBuy = useCallback(async () => {
    await contract!.buy(IDO.id, wei, { value: wei })
    balanceExecute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, wei])

  let onWithdraw = useCallback(async () => {
    await contract!.withdraw(IDO.id, wei);
    balanceExecute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, wei])

  let onGetPayout = useCallback(async () => {
    await contract!.getPayout(IDO.id);
    paidExecute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, wei])

  useEffect(() => {
    if (signer) {
      balanceExecute();
      paidExecute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer])

  useIntervalUpdate();

  const status = rangeToStatus(IDO.params.open);
  const value = useMemo(() => ({
    status,
    wei,
    setWei,
    onBuy,
    onWithdraw,
    onGetPayout,
    paid: !!paidValue,
    balance: balanceValue || BigNumber.from(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [status, wei, setWei, balanceValue, paidValue])

  return <IDOInteractContext.Provider value={value}>
    <TokenContextProvider address={IDO.params.token} children={children} />
  </IDOInteractContext.Provider >
}