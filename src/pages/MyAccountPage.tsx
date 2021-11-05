import { CircularProgress, Heading, Stack, Button, Tag, Alert, AlertIcon } from "@chakra-ui/react"
import { BigNumber, constants } from "ethers"
import { useEffect } from "react"
import { FunctionComponent, useContext, useMemo } from "react"
import { useHistory } from "react-router"
import { IIDO } from "../abis/contracts"
import { AccountsContext } from "../contexts/AccountsContext"
import { IDOContext, IDOContextProvider } from "../contexts/IDOContext"
import { IDOsContext } from "../contexts/IDOsContext"
import { NetworkContext } from "../contexts/NetworkContext"
import { IDO } from "../utils/contractTypes"
import { useAsync } from "../utils/hooks"
import { IDOStatus } from "../utils/types"
import { rangeToStatus } from "../utils/utils"

const ParticipatingIDO: FunctionComponent = () => {
  const { IDO, ipfs } = useContext(IDOContext);
  const { push } = useHistory();

  return <Stack direction={"row"} spacing={4}>
    <Heading size={"md"} flexGrow={1}>{ipfs.title}</Heading>
    <Button onClick={() => push(`/projects/${IDO.id}`)}>Go to project</Button>
  </Stack>
}

const MyIDO: FunctionComponent = () => {
  const { network: { SeaweedAddress } } = useContext(NetworkContext)
  const { IDO, ipfs } = useContext(IDOContext);
  const { signer } = useContext(AccountsContext);
  const { push } = useHistory();
  const status = rangeToStatus(IDO.params.open)

  const getRaised = () => {
    IIDO(SeaweedAddress, signer).getRaised(IDO.id)
  }

  return <Stack direction={"row"} spacing={4}>
    <Heading size={"md"} flexGrow={1}>{ipfs.title}</Heading>
    <Tag size={"md"} variant="outline">{IDOStatus[status]}</Tag>
    <Button disabled={status !== IDOStatus.Pending} onClick={() => push(`/publish/${IDO.id}/description`)}>Edit Description</Button>
    <Button disabled={status !== IDOStatus.Ended} onClick={getRaised}>Get Raised REEF</Button>
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
  const { network: { SeaweedAddress } } = useContext(NetworkContext)
  const { IDOs } = useContext(IDOsContext);
  const { selectedSigner, evmAddress } = useContext(AccountsContext);

  const myIDOs = useMemo(
    () => {
      if (IDOs === undefined || selectedSigner === undefined) return;
      return IDOs.filter((ido) => ido.owner.toLowerCase() === selectedSigner.evmAddress.toLowerCase())
    },
    [IDOs, selectedSigner]
  )

  const { value: boughtIDOs, execute } = useAsync<IDO[]>(async () => {
    let boughtIDOs = await Promise.all(
      IDOs!.map(
        ido => IIDO(SeaweedAddress, selectedSigner!.signer).boughtAmount(ido.id!, evmAddress!).then((value: BigNumber) => value.gt(constants.Zero) ? ido : undefined)
      )
    )
    return boughtIDOs.filter(e => e !== undefined);
  }, false)

  useEffect(() => {
    if (selectedSigner && IDOs !== undefined) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSigner, IDOs])

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

  let boughtIDOsElement;
  if (selectedSigner === undefined) {
    boughtIDOsElement = alertAccount;
  } else if (boughtIDOs === undefined || myIDOs === undefined) {
    boughtIDOsElement = <CircularProgress alignSelf={"center"} isIndeterminate color={"app.400"} />;
  } else if (boughtIDOs.length === 0) {
    boughtIDOsElement = alertEmpty;
  } else {
    boughtIDOsElement = boughtIDOs.map(ido => <IDOContextProvider id={ido.id!} key={ido.id}><ParticipatingIDO /></IDOContextProvider>)
  }

  return <Stack spacing={8}>
    <Heading>Participating Projects</Heading>
    <Stack spacing={8}>
      {boughtIDOsElement}
    </Stack>
    <Heading>My IDOs</Heading>
    <Stack spacing={8}>
      {myIDOsElement}
    </Stack>
  </Stack>
}