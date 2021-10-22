
import React, { useCallback, useContext, useState } from "react";
import { TxFactory, TxParams } from "../utils/txFactorys";
import { AccountsContext } from "./AccountsContext";
import { NetworkContext } from "./NetworkContext";
import { SignerStatusContext } from "./SignerStatusContext";

interface TxContextInterface {
  active: boolean,
  setActive: (state: boolean) => any
  call: (args: any) => void
  setTx: (params: TxParams) => void,
  factory?: TxFactory
}

export const TxContext = React.createContext<TxContextInterface>({
  active: false,
  setActive: () => { },
  call: () => { },
  setTx: () => { },
});

export const TxContextProvider: React.FunctionComponent = ({ children }) => {
  const [active, setActive] = useState<boolean>(false);
  const [factory, setFactory] = useState<TxFactory>();
  const { provider } = useContext(NetworkContext);
  const { selectedSigner } = useContext(AccountsContext);
  const { updateStatus } = useContext(SignerStatusContext)
  let setTx = useCallback((factory: TxParams) => {
    setFactory({ ...factory, provider: provider!, signer: selectedSigner! })
    setActive(true)
  }, [provider, selectedSigner])

  let call = useCallback(async (params: any) => {
    await factory?.type.action({ ...factory, params })
    setActive(false)
    updateStatus()
  }, [factory, updateStatus])

  return <TxContext.Provider value={
    {
      active,
      factory,
      setActive,
      call,
      setTx
    }} >
    {children}
  </TxContext.Provider >
}