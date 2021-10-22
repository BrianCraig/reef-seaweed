
import React, { useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "../utils/hooks";
import { Contract } from "ethers"

import ERC20Abi from "../abis/erc20.abi.json"
import { AccountsContext } from "./AccountsContext";

interface ContractsContextInterface {
  ERC20Contracts: Map<string, Contract>
}

export const ContractsContext = React.createContext<ContractsContextInterface>({
  ERC20Contracts: new Map()
});

export const ContractsContextProvider: React.FunctionComponent = ({ children }) => {
  const { selectedSigner } = useContext(AccountsContext)
  const [contractsList, setContractsList] = useLocalStorage<string[]>("ERC20Contracts", [])
  useEffect(() => {
    const load = async (): Promise<void> => {
      if (contractsList.length < 1) {
        setContractsList(["0xbc632D46e589d6105B156F073f029FDF56Fe694A"])
      }
    }
    load()
  }, [contractsList, setContractsList])

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
      ERC20Contracts
    }} >
    {children}
  </ContractsContext.Provider >
}