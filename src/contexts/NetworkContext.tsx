import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { WsProvider } from '@polkadot/api';
import { Provider } from '@reef-defi/evm-provider';
import { useLocalStorage } from '../utils/hooks';

export type AvailableNetworks = 'mainnet' | 'testnet';
export interface ReefNetwork {
  rpcUrl: string;
  reefscanUrl: string;
  SeaweedAddress: string;
  name: AvailableNetworks;
}
type ReefNetworks = Record<AvailableNetworks, ReefNetwork>;

export const reefNetworks: ReefNetworks = {
  testnet: {
    name: 'testnet',
    rpcUrl: 'wss://rpc-testnet.reefscan.com/ws',
    reefscanUrl: 'https://testnet.reefscan.com/',
    SeaweedAddress: "0xBC2683D0eA7D0e7714AFD00FB84Cb8AD981b5A0B"
  },
  mainnet: {
    name: 'mainnet',
    rpcUrl: 'wss://rpc.reefscan.com/ws',
    reefscanUrl: 'https://reefscan.com/',
    SeaweedAddress: "0x916cD9a007cd4fc891834057bFA89143E2aC072c"
  },
};

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
    {children}
  </NetworkContext.Provider >
}