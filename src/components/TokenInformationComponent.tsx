import { Contract, utils } from "ethers"
import { Button, majorScale, Pane, Text } from "evergreen-ui"
import { useContext, useEffect } from "react"
import { AccountsContext } from "../contexts/AccountsContext"
import { TxContext } from "../contexts/TxContext"
import { useAsync } from "../utils/hooks"
import { ApproveERC20TX, SendERC20TX } from "../utils/txFactorys"

export const TokenInformationComponent: React.FunctionComponent<{ contract: Contract }> = ({ contract }) => {

  const { setTx } = useContext(TxContext)
  const { selectedSigner } = useContext(AccountsContext)
  let send = () => setTx({ args: { contract }, type: SendERC20TX })
  let approve = () => setTx({ args: { contract }, type: ApproveERC20TX })
  const name = useAsync(() => contract.name(), false)
  const symbol = useAsync(() => contract.symbol(), false)
  const balance = useAsync(() => contract.balanceOf(selectedSigner?.evmAddress), false)

  useEffect(() => {
    if (selectedSigner) {
      balance.execute()
    }
    if (selectedSigner && name.status === "idle" && symbol.status === "idle") {
      name.execute()
      symbol.execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSigner])

  let bstr = balance.value ? utils.formatEther(balance.value as any).toString() : "..."

  return <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
    <Text>{name.value}: {bstr} {symbol.value}</Text>
    <Button onClick={send}>Send</Button>
    <Button onClick={approve}>Approve</Button>
    <Text>{contract.address}</Text>
  </Pane>
}