import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { WsProvider } from '@polkadot/api';
import { Provider } from '@reef-defi/evm-provider';

export type AvailableNetworks = 'mainnet' | 'testnet';
export interface ReefNetwork {
  rpcUrl: string;
  reefscanUrl: string;
  routerAddress: string;
  factoryAddress: string;
  name: AvailableNetworks;
}
type ReefNetworks = Record<AvailableNetworks, ReefNetwork>;

export const reefNetworks: ReefNetworks = {
  testnet: {
    name: 'testnet',
    rpcUrl: 'wss://rpc-testnet.reefscan.com/ws',
    reefscanUrl: 'https://testnet.reefscan.com/',
    factoryAddress: '0xcA36bA38f2776184242d3652b17bA4A77842707e',
    routerAddress: '0x0A2906130B1EcBffbE1Edb63D5417002956dFd41',
  },
  mainnet: {
    name: 'mainnet',
    rpcUrl: 'wss://rpc.reefscan.com/ws',
    reefscanUrl: 'https://reefscan.com/',
    routerAddress: '0x641e34931C03751BFED14C4087bA395303bEd1A5',
    factoryAddress: '0x380a9033500154872813F6E1120a81ed6c0760a8',
  },
};

interface NetworkContextInterface {
  connected: boolean,
  provider?: Provider
}

export const NetworkContext = React.createContext<NetworkContextInterface>({
  connected: false
});

export const NetworkContextProvider: React.FunctionComponent = ({ children }) => {
  let [connected, setConnected] = useState<boolean>(false);
  let [provider, setProvider] = useState<Provider | undefined>();


  useEffect(() => {
    const load = async (): Promise<void> => {
      const newProvider = new Provider({
        provider: new WsProvider(reefNetworks.testnet.rpcUrl),
      });
      await newProvider.api.isReadyOrError;
      if (await newProvider.api.isReady) {
        setConnected(true);
        setProvider(newProvider);
      }
    }
    load();
  }, [])

  return <NetworkContext.Provider value={
    {
      connected,
      provider
    }} >
    {children}
  </NetworkContext.Provider >
}