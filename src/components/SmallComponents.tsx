import React, { useContext, useEffect, useState } from "react"
import { Text } from 'evergreen-ui'
import { AccountsContext } from "../contexts/AccountsContext"
import { NetworkContext } from "../contexts/NetworkContext"

export const ActualReefComponent = () => {
  const { selectedSigner } = useContext(AccountsContext)
  const { provider } = useContext(NetworkContext)
  const [reef, setReef] = useState<string>("");

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (provider && selectedSigner) {
        setReef((await provider.api.derive.balances.all(selectedSigner.address)).freeBalance.toHuman());
      }

    }
    load();


  }, [provider, selectedSigner])

  if (selectedSigner === undefined) return null;
  return <Text>{reef}</Text>
}