import React, { useContext, useEffect, useState } from 'react';
import { utils } from "ethers";
import { useSubscription } from "@apollo/client"
import gql from 'graphql-tag'
import { BigNumber } from '@ethersproject/bignumber';
import { IIDO, IIDOInterface } from '../abis/contracts';
import { useCallbackAsync } from '../utils/hooks';
import { IPFSIDO } from '../utils/types';
import { getMultihashFromBytes32 } from "ipfs-multihash-on-solidity";
import { NetworkContext } from './NetworkContext';
import { IDO, IPFSMultihash } from '../utils/contractTypes';

interface IDOsContextInterface {
  IDOs?: IDO[],
  ipfsMap: { [key: string]: IPFSIDO }
}

export const IDOsContext = React.createContext<IDOsContextInterface>({ ipfsMap: {} });

const errorFetching: IPFSIDO = {
  title: "Title unreachable",
  subtitle: "",
  description: "",
  logo: "",
  background: ""
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

const CONTRACT_EVENTS_GQL = gql`
subscription event($contractId: String!) {
  event(
    limit: 1
    order_by: { block_number: desc }
    where: {
      method: { _eq: "Log" }
      data: { _like: $contractId }
    }
  ) {
    data
  }
}
`

const BOUGHT = 'Bought(uint256,address,uint256,uint256)';
const WITHDRAWN = 'Withdrawn(uint256,address,uint256,uint256)';
const IDO_PUBLISHED = 'IDOPublished(uint256,((bool,address,(uint32,uint32),(bytes32,uint8,uint8),(uint256,uint256),uint256,uint256,uint256,uint256),address,uint256))';
const IPFS = 'IPFSChange(uint256,(bytes32,uint8,uint8))';

let topicNames: string[] = [
  BOUGHT,
  WITHDRAWN,
  IDO_PUBLISHED,
  IPFS
]

let topicsMap = topicNames.map(name => ({ name, topic: utils.id(name) }))

let execute = (data: any, exec: (params: { name: string, data: any }) => any) => {
  if (data && data.event[0]) {
    let parse: [{ address: string, data: string, topics: string[] }] = JSON.parse(data.event[0].data);
    if (parse[0]) {
      const { data, topics } = parse[0];
      const topic = topicsMap.find(t => t.topic === topics[0])
      if (topic) {
        let event = IIDOInterface.decodeEventLog(topic.name, data, topics);
        exec({ name: topic.name, data: event })
      }
    }
  }
}

export const IDOsContextProvider: React.FunctionComponent = ({ children }) => {
  const { provider, connected, network: { SeaweedAddress } } = useContext(NetworkContext);
  const [ipfsMap, setIPFS] = useState<{ [key: string]: IPFSIDO }>({})
  const [IDOs, setIDOs] = useState<IDO[] | undefined>()
  useCallbackAsync(async () => {
    const contract = IIDO(SeaweedAddress, provider);
    let length = ((await contract.idosLength()) as BigNumber).toNumber();
    let IDOsInfo = await Promise.all(Array.from(Array(length).keys()).map((id): Promise<IDO> => contract.information(id)))
    let ipfsKeys = IDOsInfo.map(ido => getMultihashFromBytes32(ido.params.ipfs)).filter(onlyUnique);
    IDOsInfo = IDOsInfo.map((ori, id) => ({ ...ori, id }));
    await Promise.all(
      ipfsKeys.map(
        ipfs => IPFSFetch(ipfs).then((value) => setIPFS(ori => ({ ...ori, [ipfs]: value })))
      )
    )
    setIDOs(IDOsInfo);
  }, !!provider && connected, [provider, connected])

  const { data } = useSubscription(
    CONTRACT_EVENTS_GQL,
    {
      variables: {
        contractId: `[{"address":"${SeaweedAddress.toLowerCase()}"%`,
      }
    }
  );

  useEffect(() => {
    execute(data, ({ name, data }) => {
      let numberId = data.id.toNumber() as number
      if (name === IDO_PUBLISHED) {
        const { ido } = data as { ido: IDO }
        if (IDOs !== undefined) {
          setIDOs(Object.assign([], IDOs, { [numberId]: { ...ido, id: numberId } }));
        }
      } else if (name === IPFS) {
        const { ipfs } = data as { ipfs: IPFSMultihash }
        if (IDOs !== undefined && IDOs[numberId]) {
          setIDOs(Object.assign([], IDOs,
            { [numberId]: { ...IDOs[numberId], params: { ...IDOs[numberId].params, ipfs } } }
          ));
          let ipfsUri = getMultihashFromBytes32(ipfs);
          IPFSFetch(ipfsUri).then((value) => setIPFS(ori => ({ ...ori, [ipfsUri]: value })))
        }
      } else if (name === BOUGHT) {
        const { totalBought } = data as { owner: string, quantity: BigNumber, totalBought: BigNumber }
        if (IDOs !== undefined && IDOs[numberId]) {
          setIDOs(Object.assign([], IDOs,
            { [numberId]: { ...IDOs[numberId], params: { ...IDOs[numberId].params, totalBought } } }
          ));
        }
      } else if (name === WITHDRAWN) {
        const { totalBought } = data as { owner: string, quantity: BigNumber, totalBought: BigNumber }
        if (IDOs !== undefined && IDOs[numberId]) {
          setIDOs(Object.assign([], IDOs,
            { [numberId]: { ...IDOs[numberId], params: { ...IDOs[numberId].params, totalBought } } }
          ));
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return <IDOsContext.Provider value={{
    IDOs,
    ipfsMap
  }} children={children} />
}