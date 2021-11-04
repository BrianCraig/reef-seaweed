import React, { useContext } from "react";
import { getMultihashFromBytes32 } from "ipfs-multihash-on-solidity";
import { IDO, Vesting } from "../utils/contractTypes";
import { IPFSIDO } from "../utils/types";
import { IDOsContext } from "./IDOsContext";
import { useAsync } from "../utils/hooks";
import { IIDO } from "../abis/contracts";
import { NetworkContext } from "./NetworkContext";

interface IDOContextInterface {
  IDO: IDO,
  ipfs: IPFSIDO,
  vesting?: Vesting[]
}

let defaultIPFS: IPFSIDO = {
  title: "Title not found",
  description: "",
  subtitle: ""
}

export const IDOContext = React.createContext<IDOContextInterface>({} as IDOContextInterface);

export const IDOContextProvider: React.FunctionComponent<{ id: number, onLoading?: React.ReactElement, loadVesting?: boolean }> = ({ children, id, onLoading = null, loadVesting }) => {
  const { IDOs, ipfsMap } = useContext(IDOsContext);
  const { provider } = useContext(NetworkContext)
  const { value: vesting } = useAsync<Vesting[]>(() => IIDO(provider).vestingFor(id), loadVesting && (IDOs !== undefined))
  let IDO
  if (IDOs !== undefined && IDOs[id]) {
    IDO = IDOs[id];
  }
  if (IDO === undefined) {
    return onLoading;
  }
  const ipfs = ipfsMap[getMultihashFromBytes32(IDO.params.ipfs)] || defaultIPFS
  return <IDOContext.Provider value={{
    IDO,
    ipfs,
    vesting
  }} children={children} />
}
