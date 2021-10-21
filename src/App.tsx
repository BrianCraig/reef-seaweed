import { useContext } from 'react';
import { Button, Pane, Text, majorScale, Select, Alert, InlineAlert, Heading } from 'evergreen-ui'
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
    <Pane display="flex" flexDirection={"column"} height="100vh" width="100vw" alignItems="center">
      <Pane display="flex" alignItems="center" justifyContent={"flex-end"} padding={majorScale(1)} gap={majorScale(1)} background="tint1" width="100%">
        <Text flexGrow={10} background="linear-gradient(to bottom, #121FCF 0%, #00a911 65%)" className={"clipText"}>SeaWeed</Text>
        <ActualReefComponent />
        <Select maxWidth={130} minWidth={130} value={selectedSigner?.address} onChange={event => setSelectedSigner(signers?.find(sig => sig.address === event.target.value))}>
          {signers && signers.map((signer, id) => <option value={signer.address} key={id} >{stringShorten(signer.address, 5)}</option>)}
        </Select>
        {connected ? <InlineAlert marginX={majorScale(2)} intent="success" children="Connected" /> : <InlineAlert intent="danger" children="Disconnected" />}
      </Pane>
      <Pane display="flex" flexDirection={"column"} padding={majorScale(2)} width={1080} gap={majorScale(1)} flexGrow={0} flexShrink={1}>
        <Heading is="h2" size={700}>Account information</Heading>
        <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
          <Text>Frozen: 500 REEF</Text>
          <Button>Freeze</Button>
          <Button>Unfreeze</Button>
        </Pane>
        <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
          <Text>EVM Address: 0x203948203840293</Text>
          <Button>Generate EVM</Button>
        </Pane>
        <Heading is="h2" size={700}>Tokens</Heading>
        <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
          <Text>Sea Weed Token: 193 SWT</Text>
          <Button>Send</Button>
          <Button>Approve</Button>
        </Pane>
        <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
          <Text>Another Token: 0</Text>
          <Button>Send</Button>
          <Button>Approve</Button>
        </Pane>
      </Pane>
    </Pane>
  );
}

/*
{signers && signers.map(signer => <SignerDisplay signer={signer} key={signer.address} />)}
*/

export default App;
