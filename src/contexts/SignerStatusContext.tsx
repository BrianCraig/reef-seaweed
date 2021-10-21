import React, { useContext, useEffect, useState } from 'react';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { useUpdate } from '../utils/utils';
import { NetworkContext } from './NetworkContext';
import { AccountsContext } from './AccountsContext';


interface SignerStatusContextInterface {
  status?: DeriveBalancesAll,
  updateStatus: () => void
}

export const SignerStatusContext = React.createContext<SignerStatusContextInterface>({
  updateStatus: () => { }
});

export const SignerStatusContextProvider: React.FunctionComponent = ({ children }) => {
  const { selectedSigner } = useContext(AccountsContext)
  const { provider } = useContext(NetworkContext)
  const [status, setStatus] = useState<DeriveBalancesAll | undefined>()
  const updateStatus = useUpdate();

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (provider && selectedSigner) {
        setStatus(await provider.api.derive.balances.all(selectedSigner.address))
      }
    }
    load();

  }, [provider, selectedSigner, updateStatus])

  return <SignerStatusContext.Provider value={
    {
      status,
      updateStatus
    }} >
    {children}
  </SignerStatusContext.Provider >
}