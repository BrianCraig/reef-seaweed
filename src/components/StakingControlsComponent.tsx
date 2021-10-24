import { Contract, utils } from "ethers"
import { Button, majorScale, Pane, Text } from "evergreen-ui"
import { useContext, useEffect } from "react"
import { AccountsContext } from "../contexts/AccountsContext"
import { TxContext } from "../contexts/TxContext"
import { useAsync } from "../utils/hooks"
import { StakeTX, WithdrawTX } from "../utils/txFactorys"
import stckMockSol from "../abis/stacking.mock.solidity.abi.json";

let contract = new Contract('0x4B148C4588560a26cd440aa55C8A88A5e88854e6', stckMockSol.abi);

export const StakingControlsComponent: React.FunctionComponent = () => {
  const { setTx } = useContext(TxContext)
  const { selectedSigner } = useContext(AccountsContext)
  let stack = () => setTx({ args: { contract: contract.connect(selectedSigner?.signer as any) }, type: StakeTX })
  let withdraw = () => setTx({ args: { contract: contract.connect(selectedSigner?.signer as any) }, type: WithdrawTX })
  const amount = useAsync(() => contract.connect(selectedSigner?.signer as any).staking(selectedSigner?.evmAddress), false)

  useEffect(() => {
    if (selectedSigner) {
      amount.execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSigner])

  let astr = amount.value ? utils.formatEther(amount.value as any).toString() : "..."

  return <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
    <Button onClick={stack}>Stack</Button>
    <Button onClick={withdraw}>Withdraw</Button>
    <Text>{astr}</Text>
  </Pane>
}