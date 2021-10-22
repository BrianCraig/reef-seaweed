import React, { useContext, useEffect, useState } from 'react';

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { Signer as InjectedSigner } from '@polkadot/api/types';
import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { Provider, Signer } from '@reef-defi/evm-provider';
import { ensure, sleep } from '../utils/utils';
import { NetworkContext } from './NetworkContext';
import { AccountSigner } from '../utils/types';

interface AccountsContextInterface {
  accounts?: InjectedAccountWithMeta[],
  signers?: AccountSigner[],
  selectedSigner?: AccountSigner,
  setSelectedSigner: React.Dispatch<React.SetStateAction<AccountSigner | undefined>>
}

export const AccountsContext = React.createContext<AccountsContextInterface>({
  setSelectedSigner: () => { }
});

export const accountToSigner = async (account: InjectedAccountWithMeta, provider: Provider, sign: InjectedSigner): Promise<AccountSigner> => {
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

export const accountsToSigners = async (accounts: InjectedAccountWithMeta[], provider: Provider, sign: InjectedSigner): Promise<AccountSigner[]> => Promise.all(accounts.map((account) => accountToSigner(account, provider, sign)));

export const AccountsContextProvider: React.FunctionComponent = ({ children }) => {
  const { provider } = useContext(NetworkContext)
  const [injected, setInjected] = useState<InjectedExtension[] | undefined>()
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | undefined>()
  const [signers, setSigners] = useState<AccountSigner[] | undefined>();
  const [selectedSigner, setSelectedSigner] = useState<AccountSigner | undefined>();

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (!accounts) {
        await sleep(300); // Sometimes web3enable fails due to extension not injected
        const inj = await web3Enable('SeaWeed');
        ensure(inj.length > 0, 'SeaWeed can not be access Polkadot-Extension. Please install <a href="https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/" target="_blank">Polkadot-Extension</a> in your browser and refresh the page to use Reefswap.');

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
        setSelectedSigner(signers[0])
      }
    }
    load();
  }, [provider, accounts, injected])

  return <AccountsContext.Provider value={
    {
      accounts,
      signers,
      selectedSigner,
      setSelectedSigner
    }} >
    {children}
  </AccountsContext.Provider >
}