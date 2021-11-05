import { BigNumber } from 'ethers';
import React, { useContext, useEffect } from 'react';
import { IERC20 } from '../abis/contracts';
import { useAsync } from '../utils/hooks';
import { AccountsContext } from './AccountsContext';
import { NetworkContext } from './NetworkContext';

interface TokenContextInterface {
  name: string,
  symbol: string,
  decimals: number,
  balance?: BigNumber
}

const defaultValue: TokenContextInterface = {
  name: "",
  symbol: "",
  decimals: 18
}

export const TokenContext = React.createContext<TokenContextInterface>(defaultValue);

export const TokenContextProvider: React.FunctionComponent<{ address: string, withBalance?: boolean }> = ({ children, address, withBalance }) => {
  const { provider } = useContext(NetworkContext);
  const { selectedSigner } = useContext(AccountsContext);
  const { value: valueName } = useAsync<string>(() => IERC20(address, provider).name(), !!provider);
  const { value: valueSymbol } = useAsync<string>(() => IERC20(address, provider).symbol(), !!provider);
  const { value: balance, execute: executeBalance } = useAsync<BigNumber>(() => IERC20(address, selectedSigner!.signer).balanceOf(selectedSigner!.evmAddress), false);

  useEffect(() => {
    if (selectedSigner) {
      executeBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSigner])

  return <TokenContext.Provider value={{
    name: valueName || defaultValue.name,
    symbol: valueSymbol || defaultValue.symbol,
    decimals: defaultValue.decimals,
    balance
  }} >
    {children}
  </TokenContext.Provider >
}