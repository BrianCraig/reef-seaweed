import React, { useContext } from 'react';
import { IIDO, ILocking } from '../abis/contracts';
import { useAsync } from '../utils/hooks';
import { zeroAddress } from '../utils/utils';
import { NetworkContext } from './NetworkContext';

interface LockingContextInterface {
  tokenAddress?: string,
  contractAddress?: string
}

export const LockingContext = React.createContext<LockingContextInterface>({});

export const LockingContextProvider: React.FunctionComponent = ({ children }) => {
  const { network: { SeaweedAddress } } = useContext(NetworkContext)
  const { provider } = useContext(NetworkContext);
  const { value: contractAddress } = useAsync<string>(() => IIDO(SeaweedAddress, provider!).lockingContract(), !!provider)
  const { value: tokenAddress } = useAsync<string>(() => ILocking(contractAddress!, provider!).tokenAddress(), !!provider && contractAddress !== undefined && contractAddress !== zeroAddress)

  return <LockingContext.Provider value={{
    tokenAddress,
    contractAddress
  }} children={children} />
}