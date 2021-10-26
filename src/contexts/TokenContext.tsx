import React, { useContext, useEffect, useMemo } from 'react';
import { IERC20 } from '../abis/contracts';
import { useAsync } from '../utils/hooks';
import { NetworkContext } from './NetworkContext';


interface TokenContextInterface {
  name: string,
  symbol: string,
  decimals: number
}

const defaultValue: TokenContextInterface = {
  name: "",
  symbol: "",
  decimals: 18
}

export const TokenContext = React.createContext<TokenContextInterface>(defaultValue);

export const TokenContextProvider: React.FunctionComponent<{ address: string }> = ({ children, address }) => {
  const { connected, provider } = useContext(NetworkContext);
  const { execute: executeName, status: statusName, value: valueName } = useAsync<string>(() => IERC20(address).connect(provider as any).name(), false);
  const { execute: executeSymbol, status: statusSymbol, value: valueSymbol } = useAsync<string>(() => IERC20(address).connect(provider as any).symbol(), false);

  useEffect(() => {
    if (connected && statusName === "idle" && statusSymbol === "idle") {
      executeName();
      executeSymbol()
    }
  }, [connected, statusName, statusSymbol, executeName, executeSymbol])

  let value = useMemo(() => ({
    name: valueName || defaultValue.name,
    symbol: valueSymbol || defaultValue.symbol,
    decimals: defaultValue.decimals
  }), [valueName, valueSymbol])

  return <TokenContext.Provider value={value} >
    {children}
  </TokenContext.Provider >
}