import { FunctionComponent, useContext } from "react"
import { BigNumber, utils, constants } from "ethers"
import { CircularProgress, Stack, Heading, Text, Stat, StatGroup, StatLabel, StatNumber, Input, Button, Alert, AlertIcon } from "@chakra-ui/react"
import { LockingContext } from "../contexts/LockingContext"
import { TokenContext, TokenContextProvider } from "../contexts/TokenContext"
import { useEffect } from "react"
import { AccountsContext } from "../contexts/AccountsContext"
import { useAsync, useInput } from "../utils/hooks"
import { IERC20, ILocking } from "../abis/contracts"
import { timestampToDate } from "../utils/utils"
import { format } from "date-fns"

const onLoading = <Stack spacing={8} alignItems={"center"} overflow={"hidden"}>
  <Heading>Loading Locking data</Heading>
  <CircularProgress isIndeterminate color={"app.400"} />
</Stack>

const Locking: FunctionComponent = () => {
  const { contractAddress, tokenAddress } = useContext(LockingContext);
  const { selectedSigner, onConnect } = useContext(AccountsContext);
  const { balance, symbol } = useContext(TokenContext);
  const [swd, setSwd] = useInput("");

  const { value: locked, execute: executeLocked } = useAsync<[BigNumber, BigNumber]>(() => ILocking(contractAddress!, selectedSigner!.signer).locked(selectedSigner!.evmAddress), false);
  const { value: allowance, execute: executeAllowance } = useAsync<BigNumber>(() => IERC20(tokenAddress!, selectedSigner!.signer).allowance(selectedSigner!.evmAddress, contractAddress!), false);

  useEffect(() => {
    if (selectedSigner) {
      executeLocked();
      executeAllowance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSigner])

  const approve = async () => {
    await IERC20(tokenAddress!, selectedSigner!.signer).approve(contractAddress!, constants.MaxUint256);
    executeLocked();
    executeAllowance();
  }

  const lock = async () => {
    await ILocking(contractAddress!, selectedSigner!.signer).lock(utils.parseEther(swd));
    executeLocked();
    executeAllowance();
  }

  const unlock = async () => {
    await ILocking(contractAddress!, selectedSigner!.signer).unlock(utils.parseEther(swd));
    executeLocked();
    executeAllowance();
  }

  let lockedDate = "..."
  if (locked) {
    if (locked[1].eq(BigNumber.from(0))) {
      lockedDate = "---"
    } else {
      lockedDate = format(timestampToDate(locked[1]), "PPpp")
    }
  }

  const needsAllowance = !!allowance && allowance.eq(BigNumber.from(0))

  return <Stack spacing={8} >
    <Heading>Locking</Heading>
    <Heading size={"md"}>Lock $SWD to participate in IDOs</Heading>
    <StatGroup>
      <Stat>
        <StatLabel>Available</StatLabel>
        <StatNumber>{balance ? utils.formatEther(balance) : "..."} ${symbol}</StatNumber>
      </Stat>
      <Stat>
        <StatLabel>Locked</StatLabel>
        <StatNumber>{locked ? utils.formatEther(locked[0]) : "..."} ${symbol}</StatNumber>
      </Stat>
      <Stat>
        <StatLabel>Unlock Date</StatLabel>
        <StatNumber>{lockedDate}</StatNumber>
      </Stat>
    </StatGroup>
    <Stack direction={"row"} alignItems={"center"} justifyItems={"center"} >
      <Input type={"number"} width={300} placeholder={"$SWD"} value={swd} onChange={setSwd} />
      <Button disabled={needsAllowance} onClick={lock}>Lock</Button>
      <Button disabled={needsAllowance} onClick={unlock}>Unlock</Button>
    </Stack>
    {needsAllowance && <Alert status="info" variant="subtle">
      <AlertIcon />
      <Text flexGrow={1}>You need to Approve the $SWD token usage from the contract first.</Text>
      <Button onClick={approve}>Approve</Button>
    </Alert>}
    {!selectedSigner && <Alert status="info" variant="subtle">
      <AlertIcon />
      <Text flexGrow={1}>You need to connect your wallet first.</Text>
      <Button onClick={onConnect}>Connect</Button>
    </Alert>}
  </Stack>
}

export const LockingPage: FunctionComponent = () => {
  const { tokenAddress } = useContext(LockingContext);
  if (tokenAddress === undefined) return onLoading;
  return <TokenContextProvider address={tokenAddress} withBalance>
    <Locking />
  </TokenContextProvider>
}
