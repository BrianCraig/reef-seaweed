import React from 'react';
import ReactDOM from 'react-dom';
import { Layout } from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/client';
import { NetworkContextProvider } from './contexts/NetworkContext';
import { AccountsContextProvider } from './contexts/AccountsContext';
import { SignerStatusContextProvider } from './contexts/SignerStatusContext';
import { TxContextProvider } from './contexts/TxContext';
import { ContractsContextProvider } from './contexts/ContractsContext';
import { ChakraProvider } from '@chakra-ui/react';
import { appTheme } from './utils/chakraTheme';
import { IDOsContextProvider } from './contexts/IDOsContext';
import { apolloClientInstance } from './utils/apolloClient';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClientInstance}>
      <ChakraProvider theme={appTheme}>
        <NetworkContextProvider>
          <AccountsContextProvider>
            <SignerStatusContextProvider>
              <IDOsContextProvider>
                <TxContextProvider>
                  <ContractsContextProvider>
                    <Layout />
                  </ContractsContextProvider>
                </TxContextProvider>
              </IDOsContextProvider>
            </SignerStatusContextProvider>
          </AccountsContextProvider>
        </NetworkContextProvider>
      </ChakraProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
