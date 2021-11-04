import { FunctionComponent, useContext } from "react";
import { Stack, Heading, Input, Button, useToast } from "@chakra-ui/react"

import { AccountsContext } from "../contexts/AccountsContext";
import { SeaweedIDO } from "../abis/contracts";

export const ToolsPage: FunctionComponent = () => {
  const { selectedSigner } = useContext(AccountsContext);
  const toast = useToast();

  if (selectedSigner === undefined) return <Heading>Connect wallet first</Heading>

  let deploySeaweed = async () => {
    const { address } = await SeaweedIDO.connect(selectedSigner!.signer as any).deploy();
    toast({
      title: "Seaweed IDO deployed",
      description: `deployed at ${address}`,
      status: "success",
      isClosable: true,
      position: "top"
    })
  }
  return <Stack spacing={4}>
    <Heading>Deploy</Heading>
    <Stack direction={"row"}>
      <Input /><Button>Deploy Locking Contract</Button>
    </Stack>
    <Button onClick={deploySeaweed}>Deploy Seaweed IDO Contract</Button>
  </Stack>

}