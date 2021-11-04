import React, { } from 'react';
import { useContext } from 'react-transition-group/node_modules/@types/react';
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
  const { provider } = useContext(NetworkContext);
  const { value: contractAddress } = useAsync<string>(() => IIDO(provider!).lockingContract(), !!provider)
  const { value: tokenAddress } = useAsync<string>(() => ILocking(contractAddress!, provider!).lockingContract(), !!provider && contractAddress !== undefined && contractAddress !== zeroAddress)

  return <LockingContext.Provider value={{
    tokenAddress,
    contractAddress
  }} children={children} />
}