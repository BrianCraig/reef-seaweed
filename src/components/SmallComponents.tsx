import React, { useContext } from "react"
import { Text, Select, majorScale, InlineAlert, Button } from 'evergreen-ui'
import { SignerStatusContext } from "../contexts/SignerStatusContext"
import { AccountsContext } from "../contexts/AccountsContext"
import { stringShorten } from '@polkadot/util';
import { NetworkContext } from "../contexts/NetworkContext";
import { TxContext } from "../contexts/TxContext";
import { TransferTx } from "../utils/txFactorys";

export const ActualReefComponent = () => {
  const { status } = useContext(SignerStatusContext)
  if (status === undefined) return null;
  return <Text>{status.freeBalance.toHuman()}</Text>
}

export const SelectAccountComponent = () => {
  const { signers, selectedSigner, setSelectedSigner } = useContext(AccountsContext);
  return <Select maxWidth={130} minWidth={130} value={selectedSigner?.address} onChange={event => setSelectedSigner(signers?.find(sig => sig.address === event.target.value))}>
    {signers && signers.map((signer, id) => <option value={signer.address} key={id} >{stringShorten(signer.address, 5)}</option>)}
  </Select>
}

export const ConnectionStatusComponent = () => {
  const { connected } = useContext(NetworkContext);
  return (connected ? <InlineAlert marginX={majorScale(2)} intent="success" children="Connected" /> : <InlineAlert intent="danger" children="Disconnected" />)
}

export const ReefManageComponent = () => {
  const { status } = useContext(SignerStatusContext)
  const { setTx } = useContext(TxContext)
  let transfer = () => setTx({ args: {}, type: TransferTx })
  return <>
    <Text>REEF: {status?.freeBalance.toHuman() || " "}</Text>
    <Button onClick={transfer}>Transfer</Button>
  </>
}