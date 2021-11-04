import { FunctionComponent, useContext } from "react";
import { Stack } from "@chakra-ui/react"
import { Heading, Pane, majorScale, Button, Text } from "evergreen-ui";
import { ContractDeployerComponent } from "../components/ContractDeployerComponent";
import { ContractListEditorComponent } from "../components/ListEditorComponent";
import { StakingControlsComponent } from "../components/StakingControlsComponent";
import { TokenInformationComponent } from "../components/TokenInformationComponent";
import { AccountsContext } from "../contexts/AccountsContext";
import { ContractsContext } from "../contexts/ContractsContext";
import { TxContext } from "../contexts/TxContext";
import { ClaimEvmTx } from "../utils/txFactorys";
import { IDOListcomponent } from "../components/IDOListComponent";

export const ToolsPage: FunctionComponent = () => {
  const { selectedSigner } = useContext(AccountsContext);
  const { setTx } = useContext(TxContext)
  const { ERC20Contracts } = useContext(ContractsContext)
  let claimEvm = () => setTx({ args: {}, type: ClaimEvmTx })

  return <Stack margin={2}>
    <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
      <Text>EVM Address: {selectedSigner?.evmAddress || " "}</Text>
      {!selectedSigner?.isEvmClaimed && <Button onClick={claimEvm}>Generate EVM</Button>}
    </Pane>
    <Heading is="h2" size={700}>Tokens</Heading>
    {Array.from(ERC20Contracts.entries()).map(([key, contract]) => <TokenInformationComponent key={key} contract={contract} />)}
    <Heading is="h2" size={700}>Contract Deployer</Heading>
    <ContractDeployerComponent />
    <Heading is="h2" size={700}>Stacking Controls</Heading>
    <StakingControlsComponent />
    <Heading is="h2" size={700}>Contract addresses</Heading>
    <ContractListEditorComponent />
    <Heading is="h2" size={700}>IDO list</Heading>
    <IDOListcomponent />
  </Stack>

}