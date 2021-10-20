import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { Signer as InjectedSigner } from '@polkadot/api/types';
import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { Provider, Signer } from '@reef-defi/evm-provider';
import { ensure } from '../utils/utils';
import { NetworkContext } from './NetworkContext';
import { ReefswapSigner } from '../utils/types';

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

interface AccountsContextInterface {
  accounts?: InjectedAccountWithMeta[],
  signers?: ReefswapSigner[]
}

export const AccountsContext = React.createContext<AccountsContextInterface>({
});

export const accountToSigner = async (account: InjectedAccountWithMeta, provider: Provider, sign: InjectedSigner): Promise<ReefswapSigner> => {
  const signer = new Signer(provider, account.address, sign);
  const evmAddress = await signer.getAddress();
  const isEvmClaimed = await signer.isClaimed();

  return {
    signer,
    evmAddress,
    isEvmClaimed,
    name: account.meta.name || '',
    address: account.address,
  };
};

export const accountsToSigners = async (accounts: InjectedAccountWithMeta[], provider: Provider, sign: InjectedSigner): Promise<ReefswapSigner[]> => Promise.all(accounts.map((account) => accountToSigner(account, provider, sign)));

export const AccountsContextProvider: React.FunctionComponent = ({ children }) => {
  const { provider } = useContext(NetworkContext)
  const [injected, setInjected] = useState<InjectedExtension[] | undefined>()
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | undefined>()
  const [signers, setSigners] = useState<ReefswapSigner[] | undefined>();

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (!accounts) {
        const inj = await web3Enable('Reefswap');
        ensure(inj.length > 0, 'Reefswap can not be access Polkadot-Extension. Please install <a href="https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/" target="_blank">Polkadot-Extension</a> in your browser and refresh the page to use Reefswap.');

        const web3accounts = await web3Accounts();
        ensure(web3accounts.length > 0, 'Reefswap requires at least one account Polkadot-extension. Please create or import account/s and refresh the page.');

        setAccounts(web3accounts);
        setInjected(inj)
      }
    }
    load();
  }, [accounts])


  useEffect(() => {
    const load = async (): Promise<void> => {
      if (provider && accounts && injected) {
        const signers = await accountsToSigners(
          accounts,
          provider,
          injected[0].signer,
        );
        setSigners(signers);
      }
    }
    load();
  }, [provider, accounts, injected])

  return <AccountsContext.Provider value={
    {
      accounts,
      signers
    }} >
    {children}
  </AccountsContext.Provider >
}