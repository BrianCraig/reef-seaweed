import { FunctionComponent, useContext } from "react";
import { Stack, Heading, Input, Button, useToast } from "@chakra-ui/react"

import { AccountsContext } from "../contexts/AccountsContext";
import { IIDO, LockingContract, SeaweedIDO } from "../abis/contracts";
import { useInput } from "../utils/hooks";
import { NetworkContext } from "../contexts/NetworkContext";

export const ToolsPage: FunctionComponent = () => {
  const { network: { SeaweedAddress } } = useContext(NetworkContext)
  const { signer } = useContext(AccountsContext);
  const [lockingTokenAddress, setLockingTokenAddress] = useInput("");
  const [lockingContractAddress, setLockingContractAddress] = useInput("");
  const [lockingTime, setLockingTime] = useInput("");
  const toast = useToast();

  if (signer === undefined) return <Heading>Connect wallet first</Heading>

  let deploySeaweed = async () => {
    const { address } = await SeaweedIDO.connect(signer).deploy();
    toast({
      title: "Seaweed IDO deployed",
      description: `deployed at ${address}`,
      status: "success",
      isClosable: true,
      position: "top"
    })
  }

  let deployLocking = async () => {
    const { address } = await LockingContract.connect(signer).deploy(lockingTokenAddress);
    toast({
      title: "Locking contract deployed",
      description: `deployed at ${address}`,
      status: "success",
      isClosable: true,
      position: "top"
    })
  }

  let onLockingContract = async () => {
    await IIDO(SeaweedAddress, signer).setLockingAddress(lockingContractAddress);
    toast({
      title: "Locking contract address changed",
      status: "success",
      isClosable: true,
      position: "top"
    })
  }

  return <Stack spacing={4}>
    <Heading>Deploy</Heading>
    <Stack direction={"row"} alignItems={"flex-start"}>
      <Input width={300} value={lockingTokenAddress} onChange={setLockingTokenAddress} placeholder={"0xaf..."} /><Button onClick={deployLocking}>Deploy Locking Contract</Button>
    </Stack>
    <Button onClick={deploySeaweed} alignSelf={"flex-start"}>Deploy Seaweed IDO Contract</Button>
    <Heading>Update</Heading>
    <Stack direction={"row"} alignItems={"flex-start"}>
      <Input width={300} value={lockingContractAddress} onChange={setLockingContractAddress} placeholder={"0xaf..."} /><Button onClick={onLockingContract}>Set Locking contract address</Button>
    </Stack>
    <Stack direction={"row"} alignItems={"flex-start"}>
      <Input width={300} value={lockingTime} onChange={setLockingTime} placeholder={"0xaf..."} /><Button>Set Locking time</Button>
    </Stack>
  </Stack>

}