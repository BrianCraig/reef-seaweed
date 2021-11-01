import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { IIDO } from '../abis/contracts';
import { useAsync, useIntervalUpdate } from '../utils/hooks';
import { AccountsContext } from './AccountsContext';
import { TokenContextProvider } from './TokenContext';
import { IDOStatus, IPFSIDO } from '../utils/types';
import { rangeToStatus } from '../utils/utils';
import { getMultihashFromBytes32 } from "ipfs-multihash-on-solidity";
import { IDOContext } from './IDOContext';
import { IDO } from '../utils/contractTypes';
import { IDOsContext } from './IDOsContext';

interface IDOInteractContextInterface {
  status?: IDOStatus,
  wei: BigNumber,
  setWei: React.Dispatch<React.SetStateAction<BigNumber>>
  onBuy: () => any,
  onWithdraw: () => any,
  onGetPayout: () => any,
  balance: BigNumber,
  paid: boolean,
  ipfs?: IPFSIDO
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

const errorFetching: IPFSIDO = {
  title: "Title unreachable",
  subtitle: "",
  description: ""
}

const IPFSFetch = async (ido: IDO): Promise<IPFSIDO> => {
  try {
    let id = getMultihashFromBytes32(ido.params.ipfs);
    let page = await fetch(`https://ipfs.infura.io/ipfs/${id}`)
    return await page.json()
  } catch {
    return errorFetching
  }
}

export const IDOInteractContextProvider: React.FunctionComponent = ({ children }) => {
  const { address } = useContext(IDOsContext);
  const { IDO } = useContext(IDOContext);
  const { selectedSigner } = useContext(AccountsContext);
  const [wei, setWei] = useState<BigNumber>(BigNumber.from(0));
  let contract = selectedSigner ? IIDO(address).connect(selectedSigner.signer as any) : undefined;
  const { execute: balanceExecute, status: balanceStatus, value: balanceValue } = useAsync<any>(() => contract!.boughtAmount(IDO.id, selectedSigner!.evmAddress), false);
  const { execute: paidExecute, status: paidStatus, value: paidValue } = useAsync<boolean>(() => contract!.beenPaid(IDO.id, selectedSigner!.evmAddress), false);
  const { value: ipfsValue } = useAsync<IPFSIDO>(() => IPFSFetch(IDO), true);

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

  let onGetPayout = useCallback(async () => {
    await contract!.getPayout();
    paidExecute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, wei])

  useEffect(() => {
    if (selectedSigner && balanceStatus === "idle") {
      balanceExecute();
    }
  }, [selectedSigner, balanceStatus, balanceExecute])

  useEffect(() => {
    if (selectedSigner && paidStatus === "idle") {
      paidExecute();
    }
  }, [selectedSigner, paidStatus, paidExecute])

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
    balance: balanceValue || BigNumber.from(0),
    ipfs: ipfsValue
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [status, wei, setWei, balanceValue, paidValue, ipfsValue])

  return <IDOInteractContext.Provider value={value}>
    <TokenContextProvider address={IDO.params.token} children={children} />
  </IDOInteractContext.Provider >
}