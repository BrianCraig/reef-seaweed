import React, { useContext, useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { IIDO } from '../abis/contracts';
import { useAsync } from '../utils/hooks';
import { IPFSIDO } from '../utils/types';
import { getMultihashFromBytes32 } from "ipfs-multihash-on-solidity";
import { NetworkContext } from './NetworkContext';
import { IDO } from '../utils/contractTypes';

interface IDOsContextInterface {
  IDOs?: IDO[],
  ipfsMap: { [key: string]: IPFSIDO }
}

export const IDOsContext = React.createContext<IDOsContextInterface>({ ipfsMap: {} });

const errorFetching: IPFSIDO = {
  title: "Title unreachable",
  subtitle: "",
  description: ""
}

const IPFSFetch = async (ipfs: string): Promise<IPFSIDO> => {
  try {
    let page = await fetch(`https://ipfs.infura.io/ipfs/${ipfs}`)
    return await page.json()
  } catch {
    return errorFetching
  }
}

const onlyUnique = (value: any, index: number, self: any[]): boolean => {
  return self.indexOf(value) === index;
}

export const IDOsContextProvider: React.FunctionComponent = ({ children }) => {
  const { provider, connected } = useContext(NetworkContext);
  const [ipfsMap, setIPFS] = useState<{ [key: string]: IPFSIDO }>({})
  const { execute, value: IDOs } = useAsync<IDO[]>(async () => {
    const contract = IIDO(provider as any);
    let length = ((await contract.idosLength()) as BigNumber).toNumber();
    let IDOsInfo = await Promise.all(Array.from(Array(length).keys()).map((id): Promise<IDO> => contract.information(id)))
    let ipfsKeys = IDOsInfo.map(ido => getMultihashFromBytes32(ido.params.ipfs)).filter(onlyUnique);
    IDOsInfo = IDOsInfo.map((ori, id) => ({ ...ori, id }));
    await Promise.all(
      ipfsKeys.map(
        ipfs => IPFSFetch(ipfs).then((value) => setIPFS(ori => ({ ...ori, [ipfs]: value })))
      )
    )
    return IDOsInfo;
  }, false);

  useEffect(() => {
    if (provider && connected) {
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, connected])

  return <IDOsContext.Provider value={{
    IDOs,
    ipfsMap
  }} children={children} />
}