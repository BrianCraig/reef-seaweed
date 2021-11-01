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

interface IDOsContextInterface {

}

export const IDOsContext = React.createContext<IDOsContextInterface>({

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

export const IDOsContextProvider: React.FunctionComponent<{ address: string }> = ({ children, address }) => {
  const { provider, connected } = useContext(NetworkContext);
  const { execute, status, value } = useAsync<any>(async () => {
    const contract = IIDO(address).connect(provider as any);
    let length = ((await contract.idosLength()) as BigNumber).toNumber();
    let IDOsInfo = await Promise.all(Array.from(Array(length).keys()).map((id) => contract.information(id)))
    console.log(IDOsInfo);
    return IDOsInfo;
  }, false);

  useEffect(() => {
    if (provider && connected) {
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, connected])

  return <IDOsContext.Provider value={{}} children={children} />
}