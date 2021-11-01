import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { IIDO, SeaweedIDO } from '../abis/contracts';
import { useAsync, useIntervalUpdate } from '../utils/hooks';
import { AccountsContext } from './AccountsContext';
import { TokenContextProvider } from './TokenContext';
import { IDOStatus, InformationInterface, IPFSIDO } from '../utils/types';
import { timestampToStatus } from '../utils/utils';
import { getMultihashFromBytes32 } from "ipfs-multihash-on-solidity";
import { NetworkContext } from './NetworkContext';
import { IDO } from '../utils/contractTypes';

interface IDOsContextInterface {
  IDOs?: IDO[]
}

export const IDOsContext = React.createContext<IDOsContextInterface>({});

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

export const IDOsContextProvider: React.FunctionComponent = ({ children }) => {
  const { provider, connected } = useContext(NetworkContext);
  const { execute, value: IDOs } = useAsync<IDO[]>(async () => {
    const contract = IIDO(provider as any);
    let length = ((await contract.idosLength()) as BigNumber).toNumber();
    let IDOsInfo = await Promise.all(Array.from(Array(length).keys()).map((id): Promise<IDO> => contract.information(id)))
    IDOsInfo = IDOsInfo.map((ori, id) => ({ ...ori, id }))
    return IDOsInfo;
  }, false);

  useEffect(() => {
    if (provider && connected) {
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, connected])

  return <IDOsContext.Provider value={{
    IDOs
  }} children={children} />
}