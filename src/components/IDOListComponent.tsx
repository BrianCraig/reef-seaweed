import { Button, majorScale, Pane } from "evergreen-ui"
import { useContext, FunctionComponent } from "react"
import { useHistory } from "react-router-dom"
import { IIDO } from "../abis/contracts"
import { AccountsContext } from "../contexts/AccountsContext"

import { ContractsContext } from "../contexts/ContractsContext"
import { TxContext } from "../contexts/TxContext"
import { FulfillTX } from "../utils/txFactorys"


export const IDOListcomponent: FunctionComponent = () => {
  const { selectedSigner } = useContext(AccountsContext);
  const { setTx } = useContext(TxContext);
  const { IDOContracts } = useContext(ContractsContext)
  const contractList = Array.from(IDOContracts.entries())
  let fulfill = (address: string) => () => setTx({ args: { contract: IIDO(address).connect(selectedSigner?.signer as any) }, type: FulfillTX })
  let { push } = useHistory();

  return <Pane display={"flex"} alignItems="center" gap={majorScale(1)} flexWrap={"wrap"}>
    {contractList.map(([address]) => (<>
      <Button key={address} onClick={() => { push(`/ido/${address}`) }}>{address}</Button>
      <Button key={`${address}-f`} onClick={fulfill(address)}>Fulfill</Button>
    </>))}
  </Pane>
}