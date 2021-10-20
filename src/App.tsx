import { useContext } from 'react';
import './App.css';
import { NetworkContext } from './contexts/NetworkContext';

function App() {
  const { connected } = useContext(NetworkContext);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          {connected ? "Connected" : "Not connected"}
        </p>
      </header>
    </div>
  );
}

export default App;
