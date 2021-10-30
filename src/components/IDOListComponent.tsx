import { Button, majorScale, Pane } from "evergreen-ui"
import { useContext, FunctionComponent } from "react"
import { useHistory } from "react-router-dom"
import { ContractsContext } from "../contexts/ContractsContext"

export const IDOListcomponent: FunctionComponent = () => {
  const { IDOContracts } = useContext(ContractsContext)
  const contractList = Array.from(IDOContracts.entries())
  let { push } = useHistory();

  return <Pane display={"flex"} alignItems="center" gap={majorScale(1)} flexWrap={"wrap"}>
    {contractList.map(([address]) => (<>
      <Button key={address} onClick={() => { push(`/ido/${address}`) }}>{address}</Button>
    </>))}
  </Pane>
}