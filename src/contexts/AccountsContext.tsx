import React, { useContext, useEffect, useState } from 'react';

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { Signer as InjectedSigner } from '@polkadot/api/types';
import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { Provider, Signer } from '@reef-defi/evm-provider';
import { Signer as EtherSigner } from "ethers";
import { ensure } from '../utils/utils';
import { NetworkContext } from './NetworkContext';
import { AccountSigner } from '../utils/types';
import { useToast } from '@chakra-ui/react';

interface AccountsContextInterface {
  accounts?: InjectedAccountWithMeta[],
  signers?: AccountSigner[],
  selectedSigner?: AccountSigner,
  setSelectedSigner: React.Dispatch<React.SetStateAction<AccountSigner | undefined>>,
  signer?: EtherSigner
  evmAddress?: string;
  isEvmClaimed?: boolean;
  onConnect: () => any;
  refreshAccounts: () => void;
}

export const AccountsContext = React.createContext<AccountsContextInterface>({
  setSelectedSigner: () => { },
  onConnect: () => { },
  refreshAccounts: () => { }
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
  const toast = useToast()

  const onConnect = async (): Promise<void> => {
    try {
      if (!accounts) {
        const inj = await web3Enable('Seaweed');
        ensure(inj.length > 0, 'Seaweed can not be access Polkadot-Extension. Please install Polkadot Extension in your browser and refresh the page to use Seaweed.');
        const web3accounts = await web3Accounts();
        ensure(web3accounts.length > 0, 'Seaweed requires at least one account Polkadot-extension. Please create or import account/s and refresh the page.');
        setAccounts(web3accounts);
        setInjected(inj)
      }
    } catch (error) {
      toast({
        title: "Error ocurred while connecting to wallet.",
        description: (error as Error).message,
        status: "error",
        isClosable: true,
        position: "top"
      })
    }
  }

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

  const refreshAccounts = () => {
    setAccounts([...accounts!])
  }

  return <AccountsContext.Provider value={
    {
      accounts,
      signers,
      selectedSigner,
      setSelectedSigner,
      onConnect,
      refreshAccounts,
      signer: selectedSigner?.signer as EtherSigner,
      evmAddress: selectedSigner?.evmAddress,
      isEvmClaimed: selectedSigner?.isEvmClaimed
    }} >
    {children}
  </AccountsContext.Provider >
}