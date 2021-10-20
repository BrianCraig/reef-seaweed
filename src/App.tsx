import { useContext } from 'react';
import { ReefswapSigner } from './utils/types';
import './App.css';
import { AccountsContext } from './contexts/AccountsContext';
import { NetworkContext } from './contexts/NetworkContext';

const SignerDisplay: React.FunctionComponent<({ signer: ReefswapSigner })> = ({ signer }) => {
  return (
    <p>{signer.address} {signer.evmAddress} {signer.isEvmClaimed ? "claimed" : "not claimed"} {signer.name}</p>
  )
}

function App() {
  const { connected } = useContext(NetworkContext);
  const { signers } = useContext(AccountsContext);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          {connected ? "Connected" : "Not connected"}
        </p>
        {signers && signers.map(signer => <SignerDisplay signer={signer} key={signer.address} />)}
      </header>
    </div>
  );
}

export default App;
