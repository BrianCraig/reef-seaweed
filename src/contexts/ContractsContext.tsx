
import React, { useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "../utils/hooks";
import { Contract } from "ethers"

import ERC20Abi from "../abis/erc20.abi.json"
import { AccountsContext } from "./AccountsContext";

interface ContractsContextInterface {
  contractsList: string[]
  setContractsList: React.Dispatch<React.SetStateAction<string[]>>
  ERC20Contracts: Map<string, Contract>
}

const defaultContracts = [
  "0xbc632D46e589d6105B156F073f029FDF56Fe694A",
  "0x4b9283D177b45ffd28F3Bfc66Df7F9C59b6D7701"
]

export const ContractsContext = React.createContext<ContractsContextInterface>({
  contractsList: defaultContracts,
  setContractsList: () => { },
  ERC20Contracts: new Map()
});

export const ContractsContextProvider: React.FunctionComponent = ({ children }) => {
  const { selectedSigner } = useContext(AccountsContext)
  const [contractsList, setContractsList] = useLocalStorage<string[]>("ERC20Contracts", defaultContracts)

  let ERC20Contracts = useMemo(
    () => {
      let map = new Map<string, Contract>()
      contractsList.forEach(addr => map.set(addr, new Contract(addr, ERC20Abi, selectedSigner?.signer as any)))
      return map
    },
    [contractsList, selectedSigner]
  )
  return <ContractsContext.Provider value={
    {
      contractsList,
      setContractsList,
      ERC20Contracts
    }} >
    {children}
  </ContractsContext.Provider >
}