import { useContext } from "react"
import { Text, Select, Tag, TagLabel, TagLeftIcon, Button, Menu, MenuButton, MenuItem, MenuList, CircularProgress } from "@chakra-ui/react"
import { SignerStatusContext } from "../contexts/SignerStatusContext"
import { AccountsContext } from "../contexts/AccountsContext"
import { stringShorten } from '@polkadot/util';
import { NetworkContext } from "../contexts/NetworkContext";
import { CheckCircleIcon, CheckIcon, ChevronDownIcon, SpinnerIcon } from "@chakra-ui/icons";
export const ActualReefComponent = () => {
  const { status } = useContext(SignerStatusContext)
  if (status === undefined) return null;
  return <Text>{status.freeBalance.toHuman()}</Text>
}

export const SelectAccountComponent = () => {
  const { signers, selectedSigner, setSelectedSigner, onConnect, accounts } = useContext(AccountsContext);
  if (accounts === undefined) {
    return <Button onClick={onConnect}>Connect Wallet</Button>
  }
  return <Select width={165} value={selectedSigner?.address} onChange={event => setSelectedSigner(signers?.find(sig => sig.address === event.target.value))}>
    {signers && signers.map((signer, id) => <option value={signer.address} key={id} >{stringShorten(signer.address, 5)}</option>)}
  </Select>
}

let connectedElement = <Tag size={"lg"} variant="outline">
  <TagLeftIcon boxSize="12px" as={CheckIcon} />
  <TagLabel>Connected</TagLabel>
</Tag>

let disconnectedElement = <Tag size={"lg"} variant="outline" colorScheme={"red"}>
  <TagLeftIcon boxSize="12px" as={SpinnerIcon} />
  <TagLabel>Not Connected</TagLabel>
</Tag>

export const ConnectionStatusComponent = () => {
  const { connected, network, setNetwork } = useContext(NetworkContext);
  return <Menu>
    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant={"outline"}>
      {connected ? network.name : [<CircularProgress size={6} mr={4} color={"app.400"} isIndeterminate />, "Connecting"]}
    </MenuButton>
    <MenuList>
      <MenuItem onClick={() => setNetwork("mainnet")}>
        {network.name === "mainnet" && <CheckCircleIcon marginRight={4} />}
        Mainnet
      </MenuItem>
      <MenuItem onClick={() => setNetwork("testnet")}>
        {network.name === "testnet" && <CheckCircleIcon marginRight={4} />}
        Testnet
      </MenuItem>
    </MenuList>
  </Menu>
}