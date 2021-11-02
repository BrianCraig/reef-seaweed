import React, { useContext } from "react";
import { getMultihashFromBytes32 } from "ipfs-multihash-on-solidity";
import { IDO } from "../utils/contractTypes";
import { IPFSIDO } from "../utils/types";
import { IDOsContext } from "./IDOsContext";

interface IDOContextInterface {
  IDO: IDO,
  ipfs: IPFSIDO
}

let defaultIPFS: IPFSIDO = {
  title: "Title not found",
  description: "",
  subtitle: ""
}

export const IDOContext = React.createContext<IDOContextInterface>({} as IDOContextInterface);

export const IDOContextProvider: React.FunctionComponent<{ id: number, onLoading?: React.ReactElement }> = ({ children, id, onLoading = null }) => {
  const { IDOs, ipfsMap } = useContext(IDOsContext);
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
    ipfs
  }} children={children} />
}
