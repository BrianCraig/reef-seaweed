import { useContext } from 'react';
import { Button, Pane, Text, majorScale, Select, Alert, InlineAlert } from 'evergreen-ui'
import { stringShorten } from '@polkadot/util';
import { AccountSigner } from './utils/types';
import { AccountsContext } from './contexts/AccountsContext';
import { NetworkContext } from './contexts/NetworkContext';
import "./app.css"
import { ActualReefComponent } from './components/SmallComponents';

const SignerDisplay: React.FunctionComponent<({ signer: AccountSigner })> = ({ signer }) => {
  return (
    <p>{signer.address} {signer.evmAddress} {signer.isEvmClaimed ? "claimed" : "not claimed"} {signer.name}</p>
  )
}

function App() {
  const { connected } = useContext(NetworkContext);
  const { signers, selectedSigner, setSelectedSigner } = useContext(AccountsContext);
  return (
    <Pane display="flex" flexDirection={"column"} height="100%">
      <Pane display="flex" alignItems="center" justifyContent={"flex-end"} padding={majorScale(1)} gap={majorScale(1)} background="tint1" width="100%">
        <Text flexGrow={10} background="linear-gradient(to bottom, #121FCF 0%, #34CF43 65%)" className={"clipText"}>SeaWeed</Text>
        <ActualReefComponent />
        <Select maxWidth={130} minWidth={130} value={selectedSigner?.address} onChange={event => setSelectedSigner(signers?.find(sig => sig.address === event.target.value))}>
          {signers && signers.map((signer, id) => <option value={signer.address} key={id} >{stringShorten(signer.address, 5)}</option>)}
        </Select>
        {connected ? <InlineAlert marginX={majorScale(2)} intent="success" children="Connected" /> : <InlineAlert intent="danger" children="Disconnected" />}
      </Pane>
      <Pane height="100%">
        <Text>asdasdas</Text>
      </Pane>
    </Pane>
  );
}

/*
{signers && signers.map(signer => <SignerDisplay signer={signer} key={signer.address} />)}
*/

export default App;
