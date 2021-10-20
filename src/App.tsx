import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { NetworkContext } from './contexts/NetworkContext';

function App() {
  const { connected } = useContext(NetworkContext);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>
          {connected ? "Connected" : "Not connected"}
        </p>
      </header>
    </div>
  );
}

export default App;
