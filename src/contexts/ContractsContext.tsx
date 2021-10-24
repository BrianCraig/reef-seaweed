
import React, { useContext, useMemo } from "react";
import { useLocalStorage } from "../utils/hooks";
import { Contract } from "ethers"

import ERC20Abi from "../abis/erc20.abi.json"
import { AccountsContext } from "./AccountsContext";
import { IIDO } from "../abis/contracts";

interface ContractsContextInterface {
  contractsList: string[]
  setContractsList: React.Dispatch<React.SetStateAction<string[]>>
  ERC20Contracts: Map<string, Contract>
  IDOList: string[]
  setIDOList: React.Dispatch<React.SetStateAction<string[]>>
  IDOContracts: Map<string, Contract>
}

const defaultContracts = [
  "0xbc632D46e589d6105B156F073f029FDF56Fe694A",
  "0x4b9283D177b45ffd28F3Bfc66Df7F9C59b6D7701"
]

export const ContractsContext = React.createContext<ContractsContextInterface>({
  contractsList: defaultContracts,
  setContractsList: () => { },
  ERC20Contracts: new Map(),
  IDOList: [],
  setIDOList: () => { },
  IDOContracts: new Map()
});

export const ContractsContextProvider: React.FunctionComponent = ({ children }) => {
  const { selectedSigner } = useContext(AccountsContext)
  const [contractsList, setContractsList] = useLocalStorage<string[]>("ERC20Contracts", defaultContracts)
  const [IDOList, setIDOList] = useLocalStorage<string[]>("IDOContracts", [])
  let ERC20Contracts = useMemo(
    () => {
      let map = new Map<string, Contract>()
      contractsList.forEach(addr => map.set(addr, new Contract(addr, ERC20Abi, selectedSigner?.signer as any)))
      return map
    },
    [contractsList, selectedSigner]
  )

  let IDOContracts = useMemo(
    () => {
      let map = new Map<string, Contract>()
      IDOList.forEach(addr => map.set(addr, IIDO(addr).connect(selectedSigner?.signer as any)))
      return map
    },
    [IDOList, selectedSigner]
  )
  return <ContractsContext.Provider value={
    {
      contractsList,
      setContractsList,
      ERC20Contracts,
      IDOList,
      setIDOList,
      IDOContracts
    }} >
    {children}
  </ContractsContext.Provider >
}