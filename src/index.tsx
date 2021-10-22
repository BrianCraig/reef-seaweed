import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { NetworkContextProvider } from './contexts/NetworkContext';
import { AccountsContextProvider } from './contexts/AccountsContext';
import { SignerStatusContextProvider } from './contexts/SignerStatusContext';
import { TxContextProvider } from './contexts/TxContext';
import { ContractsContextProvider } from './contexts/ContractsContext';

ReactDOM.render(
  <React.StrictMode>
    <NetworkContextProvider>
      <AccountsContextProvider>
        <SignerStatusContextProvider>
          <TxContextProvider>
            <ContractsContextProvider>
              <App />
            </ContractsContextProvider>
          </TxContextProvider>
        </SignerStatusContextProvider>
      </AccountsContextProvider>
    </NetworkContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
