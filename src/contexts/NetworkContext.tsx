import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { WsProvider } from '@polkadot/api';
import { Provider } from '@reef-defi/evm-provider';
import { useLocalStorage } from '../utils/hooks';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { apolloClientInstance } from '../utils/apolloClient';

export type AvailableNetworks = 'mainnet' | 'testnet';
export interface ReefNetwork {
  rpcUrl: string;
  reefscanUrl: string;
  SeaweedAddress: string;
  name: AvailableNetworks;
  gqlHttps: string;
  gqlWss: string;
}
type ReefNetworks = Record<AvailableNetworks, ReefNetwork>;

export const reefNetworks: ReefNetworks = {
  testnet: {
    name: 'testnet',
    rpcUrl: 'wss://rpc-testnet.reefscan.com/ws',
    reefscanUrl: 'https://testnet.reefscan.com/',
    SeaweedAddress: "0xBC2683D0eA7D0e7714AFD00FB84Cb8AD981b5A0B",
    gqlHttps: "https://dev.reef.polkastats.io/api/v3",
    gqlWss: "wss://dev.reef.polkastats.io/api/v3",
  },
  mainnet: {
    name: 'mainnet',
    rpcUrl: 'wss://rpc.reefscan.com/ws',
    reefscanUrl: 'https://reefscan.com/',
    SeaweedAddress: "0x916cD9a007cd4fc891834057bFA89143E2aC072c",
    gqlHttps: "https://reefscan.com/api/v3",
    gqlWss: "wss://reefscan.com/api/v3"
  },
};

type ApolloClients = Record<AvailableNetworks, ApolloClient<NormalizedCacheObject>>

const apolloClientsMap: ApolloClients = {
  testnet: apolloClientInstance(reefNetworks.testnet),
  mainnet: apolloClientInstance(reefNetworks.mainnet)
}

interface NetworkContextInterface {
  connected: boolean,
  network: ReefNetwork,
  setNetwork: Dispatch<SetStateAction<AvailableNetworks>>
  provider?: Provider
}

export const NetworkContext = React.createContext<NetworkContextInterface>({
  connected: false,
  network: reefNetworks.mainnet,
  setNetwork: () => { }
});

export const NetworkContextProvider: React.FunctionComponent = ({ children }) => {
  let [network, setNetwork] = useLocalStorage<AvailableNetworks>('network', "mainnet");
  let [connected, setConnected] = useState<boolean>(false);
  let [provider, setProvider] = useState<Provider | undefined>();

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (provider) {
        await provider.api.disconnect();
        setConnected(false);
        setProvider(undefined);
      }
      const newProvider = new Provider({
        types: {
          AccountInfo: 'AccountInfoWithTripleRefCount'
        },
        provider: new WsProvider(reefNetworks[network].rpcUrl),
      });
      await newProvider.api.isReadyOrError;
      if (await newProvider.api.isReady) {
        setConnected(true);
        setProvider(newProvider);
      }
    }
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network])

  return <NetworkContext.Provider value={
    {
      connected,
      provider,
      network: reefNetworks[network],
      setNetwork
    }} >
    <ApolloProvider client={apolloClientsMap[network]}>
      {children}
    </ApolloProvider>
  </NetworkContext.Provider >
}