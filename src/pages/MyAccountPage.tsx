import { CircularProgress, Heading, Stack, Button, Tag, Alert, AlertIcon } from "@chakra-ui/react"
import { FunctionComponent, useContext, useMemo } from "react"
import { AccountsContext } from "../contexts/AccountsContext"
import { IDOContext, IDOContextProvider } from "../contexts/IDOContext"
import { IDOsContext } from "../contexts/IDOsContext"
import { IDOStatus } from "../utils/types"
import { rangeToStatus } from "../utils/utils"

const MyIDO: FunctionComponent = () => {
  const { IDO, ipfs } = useContext(IDOContext);
  const status = rangeToStatus(IDO.params.open)
  return <Stack direction={"row"} spacing={4}>
    <Heading size={"md"} flexGrow={1}>{ipfs.title}</Heading>
    <Tag size={"md"} variant="outline">{IDOStatus[status]}</Tag>
    <Button disabled={status !== IDOStatus.Pending}>Edit Description</Button>
    <Button disabled={status !== IDOStatus.Ended}>Get Raised REEF</Button>
  </Stack>
}

let alertAccount = <Alert status="info" variant="subtle">
  <AlertIcon />
  Please connect your account.
</Alert>

let alertEmpty = <Alert status="info" variant="subtle">
  <AlertIcon />
  You don't have any projects.
</Alert>

export const MyAccountPage = () => {
  const { IDOs } = useContext(IDOsContext);
  const { selectedSigner } = useContext(AccountsContext);

  const myIDOs = useMemo(
    () => {
      if (IDOs === undefined || selectedSigner === undefined) return;
      return IDOs.filter((ido) => ido.owner.toLowerCase() === selectedSigner.evmAddress.toLowerCase())
    },
    [IDOs, selectedSigner]
  )

  let myIDOsElement;
  if (IDOs === undefined) {
    myIDOsElement = <CircularProgress alignSelf={"center"} isIndeterminate color={"app.400"} />;
  } else if (selectedSigner === undefined || myIDOs === undefined) {
    myIDOsElement = alertAccount;
  } else if (myIDOs.length === 0) {
    myIDOsElement = alertEmpty;
  } else {
    myIDOsElement = myIDOs.map(ido => <IDOContextProvider id={ido.id!} key={ido.id}><MyIDO /></IDOContextProvider>)
  }

  return <Stack spacing={8}>
    <Heading>Participating Projects</Heading>
    <CircularProgress alignSelf={"center"} isIndeterminate color={"app.400"} />
    <Heading>My IDOs</Heading>
    <Stack spacing={8}>
      {myIDOsElement}
    </Stack>
  </Stack>
}