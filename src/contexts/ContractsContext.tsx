
import React, { useContext, useEffect, useMemo } from "react";
import { useAsync, useLocalStorage } from "../utils/hooks";
import { Contract } from "ethers"

import ERC20Abi from "../abis/erc20.abi.json"
import { AccountsContext } from "./AccountsContext";
import { IIDO } from "../abis/contracts";
import { NetworkContext } from "./NetworkContext";
import { FullIDOInfo, InformationInterface } from "../utils/types";

interface ContractsContextInterface {
  contractsList: string[]
  setContractsList: React.Dispatch<React.SetStateAction<string[]>>
  ERC20Contracts: Map<string, Contract>
  IDOList: string[]
  setIDOList: React.Dispatch<React.SetStateAction<string[]>>
  IDOContracts: Map<string, Contract>,
  IDOInfoMap?: FullIDOInfo[],
  IDOInfoMapLoading: boolean
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
  IDOContracts: new Map(),
  IDOInfoMapLoading: true
});

export const ContractsContextProvider: React.FunctionComponent = ({ children }) => {
  const { provider } = useContext(NetworkContext);
  const { selectedSigner } = useContext(AccountsContext)
  const [contractsList, setContractsList] = useLocalStorage<string[]>("ERC20Contracts", defaultContracts)
  const [IDOList, setIDOList] = useLocalStorage<string[]>("IDOContracts", [])
  const { execute, value: IDOInfoMap, status } = useAsync<FullIDOInfo[]>(async () => {
    let addressToInfoPromise = (address: string): Promise<InformationInterface> => IIDO(address, provider).information()
    let info = await Promise.all(IDOList.map(addressToInfoPromise))
    return IDOList.map((address, i) => ({ address, info: info[i] }))
  }, false)

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

  useEffect(() => {
    if (provider) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  return <ContractsContext.Provider value={
    {
      contractsList,
      setContractsList,
      ERC20Contracts,
      IDOList,
      setIDOList,
      IDOContracts,
      IDOInfoMap,
      IDOInfoMapLoading: status !== "success"
    }} >
    {children}
  </ContractsContext.Provider >
}