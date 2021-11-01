import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { IIDO } from '../abis/contracts';
import { useAsync, useIntervalUpdate } from '../utils/hooks';
import { AccountsContext } from './AccountsContext';
import { TokenContextProvider } from './TokenContext';
import { IDOStatus, InformationInterface, IPFSIDO } from '../utils/types';
import { timestampToStatus } from '../utils/utils';
import { getMultihashFromBytes32 } from "ipfs-multihash-on-solidity";

interface IDOInteractContextInterface {
  information?: InformationInterface
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

const IPFSFetch = async (info: InformationInterface): Promise<IPFSIDO> => {
  try {
    let id = getMultihashFromBytes32({
      size: info.ipfsSize,
      digest: info.ipfsDigest,
      hashFunction: info.ipfsHashFunction
    })
    let page = await fetch(`https://ipfs.infura.io/ipfs/${id}`)
    return await page.json()
  } catch {
    return errorFetching
  }
}

export const IDOInteractContextProvider: React.FunctionComponent<{ address: string }> = ({ children, address }) => {
  const { selectedSigner } = useContext(AccountsContext);
  const [wei, setWei] = useState<BigNumber>(BigNumber.from(0));
  let contract = selectedSigner ? IIDO(address).connect(selectedSigner.signer as any) : undefined;
  const { execute: informationExecute, status: informationStatus, value: information } = useAsync<InformationInterface>(() => contract!.information(), false);
  const { execute: balanceExecute, status: balanceStatus, value: balanceValue } = useAsync<any>(() => contract!.boughtAmount(selectedSigner!.evmAddress), false);
  const { execute: paidExecute, status: paidStatus, value: paidValue } = useAsync<boolean>(() => contract!.beenPaid(selectedSigner!.evmAddress), false);
  const { execute: ipfsExecute, status: ipfsStatus, value: ipfsValue } = useAsync<IPFSIDO>(() => IPFSFetch(information!), false);

  useEffect(() => {
    if (information && ipfsStatus === "idle") {
      ipfsExecute();
    }
  }, [information, ipfsStatus, ipfsExecute])

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

  const status = information ? timestampToStatus((information as InformationInterface)) : undefined;
  const value = useMemo(() => ({
    information: (information as InformationInterface),
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
  }), [information, status, wei, setWei, balanceValue, paidValue, ipfsValue])

  return <IDOInteractContext.Provider value={value}>
    {information?.tokenAddress ? <TokenContextProvider address={information.tokenAddress} children={children} /> : children}
  </IDOInteractContext.Provider >
}