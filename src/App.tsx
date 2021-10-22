import { useContext } from 'react';
import { Button, Pane, Text, majorScale, InlineAlert, Heading } from 'evergreen-ui'
import { AccountsContext } from './contexts/AccountsContext';
import "./app.css"
import { ActualReefComponent, ConnectionStatusComponent, SelectAccountComponent, ReefManageComponent } from './components/SmallComponents';
import { SignerStatusContext } from './contexts/SignerStatusContext';
import { TxContext } from './contexts/TxContext';
import { ClaimEvmTx } from './utils/txFactorys';
import { TxCallerComponent } from './components/TxCallerComponent';
import { ContractsContext } from './contexts/ContractsContext';
import { TokenInformationComponent } from './components/TokenInformationComponent';
import { ContractDeployerComponent } from './components/ContractDeployerComponent';

function App() {
  const { selectedSigner } = useContext(AccountsContext);
  const { status } = useContext(SignerStatusContext)
  const { setTx } = useContext(TxContext)
  const { ERC20Contracts } = useContext(ContractsContext)
  let claimEvm = () => setTx({ args: {}, type: ClaimEvmTx })
  return (
    <Pane display="flex" flexDirection={"column"} height="100vh" width="100vw" alignItems="center">
      <Pane display="flex" alignItems="center" justifyContent={"flex-end"} padding={majorScale(1)} gap={majorScale(1)} background="tint1" width="100%">
        <Text flexGrow={10} background="linear-gradient(to bottom, #121FCF 0%, #00a911 65%)" className={"clipText"}>SeaWeed</Text>
        <ActualReefComponent />
        <SelectAccountComponent />
        <ConnectionStatusComponent />
      </Pane>
      <Pane display="flex" flexDirection={"column"} padding={majorScale(2)} width={1080} gap={majorScale(1)} flexGrow={0} flexShrink={1}>
        <Heading is="h2" size={700}>Account information</Heading>
        <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
          <ReefManageComponent />
        </Pane>
        <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
          <Text>EVM Address: {selectedSigner?.evmAddress || " "}</Text>
          {!selectedSigner?.isEvmClaimed && <Button onClick={claimEvm}>Generate EVM</Button>}
        </Pane>
        <Heading is="h2" size={700}>Tokens</Heading>
        {Array.from(ERC20Contracts.entries()).map(([key, contract]) => <TokenInformationComponent key={key} contract={contract} />)}
        <Heading is="h2" size={700}>Contract Deployer</Heading>
        <ContractDeployerComponent />
      </Pane>
      <TxCallerComponent />
    </Pane>
  );
}

/*
{signers && signers.map(signer => <SignerDisplay signer={signer} key={signer.address} />)}
*/

export default App;
