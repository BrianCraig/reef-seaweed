import { ContractFactory } from "ethers"
import { Button, majorScale, Pane, Text } from "evergreen-ui"
import { useContext } from "react"
import { AccountsContext } from "../contexts/AccountsContext"
import { TxContext } from "../contexts/TxContext"
import { ContractERC20TX, ContractStackingMockTX } from "../utils/txFactorys"

import erc20Sol from "../abis/erc20.solidity.abi.json";
import stckMockSol from "../abis/stacking.mock.solidity.abi.json";

const erc20SolContract = ContractFactory.fromSolidity(erc20Sol);
const stckMockSolContract = ContractFactory.fromSolidity(stckMockSol);

export const ContractDeployerComponent: React.FunctionComponent = () => {
  const { setTx } = useContext(TxContext)
  const { selectedSigner } = useContext(AccountsContext)

  let erc20 = () => setTx({ args: { contract: erc20SolContract.connect(selectedSigner?.signer as any) }, type: ContractERC20TX })
  let stkMock = () => setTx({ args: { contract: stckMockSolContract.connect(selectedSigner?.signer as any) }, type: ContractStackingMockTX })

  return <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
    <Text>Click to Deploy</Text>
    <Button onClick={erc20}>Deploy ERC20</Button>
    <Button onClick={stkMock}>Deploy Stacking Mock</Button>
  </Pane>
}