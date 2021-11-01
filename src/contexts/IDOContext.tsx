import React, { useContext } from "react";
import { IDO } from "../utils/contractTypes";
import { IDOsContext } from "./IDOsContext";

interface IDOContextInterface {
  IDO: IDO
}

export const IDOContext = React.createContext<IDOContextInterface>({ IDO: {} as any });

export const IDOContextProvider: React.FunctionComponent<{ id: number, onLoading: React.ReactElement }> = ({ children, id, onLoading }) => {
  const { IDOs } = useContext(IDOsContext);
  let IDO
  if (IDOs !== undefined && IDOs[id]) {
    IDO = IDOs[id];
  }
  if (IDO === undefined) {
    return onLoading;
  }
  return <IDOContext.Provider value={{
    IDO
  }} children={children} />
}