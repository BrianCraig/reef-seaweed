import { useContext } from 'react';
import { Button, Pane, Text, majorScale, Select, InlineAlert, Heading } from 'evergreen-ui'
import { stringShorten } from '@polkadot/util';
import { AccountsContext } from './contexts/AccountsContext';
import { NetworkContext } from './contexts/NetworkContext';
import "./app.css"
import { ActualReefComponent } from './components/SmallComponents';
import { SignerStatusContext } from './contexts/SignerStatusContext';


function App() {
  const { connected } = useContext(NetworkContext);
  const { signers, selectedSigner, setSelectedSigner } = useContext(AccountsContext);
  const { status } = useContext(SignerStatusContext)
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
          <Text>Locked: {status?.lockedBalance.toHuman() || " "}</Text>
          <Button>Lock</Button>
          <Button>Unlock</Button>
        </Pane>
        <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
          <Text>EVM Address: {selectedSigner?.evmAddress || " "}</Text>
          {!selectedSigner?.isEvmClaimed && <Button>Generate EVM</Button>}
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
