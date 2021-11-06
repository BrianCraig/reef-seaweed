import { CheckIcon, LockIcon } from "@chakra-ui/icons"
import { Alert, AlertIcon, Image, Box, CircularProgress, Heading, SimpleGrid, Stack, Tag, TagLabel, TagRightIcon, Text } from "@chakra-ui/react"
import { utils } from "ethers";
import { FunctionComponent, useContext } from "react"
import { useHistory } from "react-router";
import { IDOContext, IDOContextProvider } from "../contexts/IDOContext";
import { IDOsContext } from "../contexts/IDOsContext";
import { IDOStatus } from "../utils/types"
import { rangeToStatus } from "../utils/utils"

let whitelistedEl = <Tag variant="solid">
  <TagLabel>Whitelisted</TagLabel>
  <TagRightIcon as={CheckIcon} />
</Tag>

let whitelistedntEl = <Tag variant="solid">
  <TagLabel>Not whitelisted</TagLabel>
  <TagRightIcon as={LockIcon} />
</Tag>

const IDOSummary: FunctionComponent<{}> = () => {
  let { push } = useHistory();
  let { IDO: { params: { baseAmount, totalBought, maxAmountPerAddress }, id }, ipfs: { title, subtitle, logo, background }, whitelisted } = useContext(IDOContext)
  return <Stack border={"1px"} borderColor={"app.400"} borderRadius={8} spacing={4} padding={4} onClick={() => push(`/projects/${id}`)}>
    <Stack direction={"row"} spacing={4}>
      <Image height={"48px"} src={`https://ipfs.infura.io/ipfs/${logo}`} alt="Project logo" />
      <Stack justifyContent={"space-between"} spacing={0}>
        <Heading size={"md"}>{title}</Heading>
        <Text>{subtitle}</Text>
      </Stack>
    </Stack>
    <Box borderTop={"1px"} borderBottom={"1px"} borderColor={"app.600"} bg={"app.100"} backgroundSize={"cover"} backgroundImage={`url("https://ipfs.infura.io/ipfs/${background}")`}>
      <Stack width={"100%"} height={140} padding={2} direction={"row"} alignItems={"flex-start"} justifyContent={"flex-end"}>
        {whitelisted !== undefined && (whitelisted ? whitelistedEl : whitelistedntEl)}
      </Stack>
    </Box>
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Text>Raise goal</Text>
      <Text>{utils.formatEther(baseAmount)} REEF</Text>
    </Stack>
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Text>Max allocation</Text>
      <Text>{utils.formatEther(maxAmountPerAddress)} REEF</Text>
    </Stack>
    <Box border={"1px"} borderColor={"app.600"} borderRadius={8} bg={"app.100"}>
      <Box width={`${totalBought.mul(10000).div(baseAmount).toNumber() / 100}%`} bg={"app.600"} height={2} />
    </Box>
  </Stack >
}

let alert = <Alert status="info" variant="subtle">
  <AlertIcon />
  No projects for this category
</Alert>

export const ProjectsPage = () => {
  let { IDOs } = useContext(IDOsContext);

  if (IDOs === undefined) return <Stack spacing={8} alignItems={"center"} overflow={"hidden"}>
    <Heading>Loading Projects</Heading>
    <CircularProgress isIndeterminate color={"app.400"} />
  </Stack>

  let pendingProjects = IDOs.filter(ido => rangeToStatus(ido.params.open) === IDOStatus.Pending)
  let openProjects = IDOs.filter(ido => rangeToStatus(ido.params.open) === IDOStatus.Open)
  let endedProjects = IDOs.filter(ido => rangeToStatus(ido.params.open) === IDOStatus.Ended)

  return <Stack spacing={8}>
    <Heading>Open projects</Heading>
    <SimpleGrid columns={openProjects.length === 0 ? 1 : 3} spacing={8}>
      {openProjects.length === 0 ? alert : null}
      {openProjects.map(ido => <IDOContextProvider id={ido.id!} key={ido.id} whitelisting><IDOSummary /></IDOContextProvider>)}
    </SimpleGrid>
    <Heading>Upcoming projects</Heading>
    <SimpleGrid columns={pendingProjects.length === 0 ? 1 : 3} spacing={8}>
      {pendingProjects.length === 0 ? alert : null}
      {pendingProjects.map(ido => <IDOContextProvider id={ido.id!} key={ido.id} whitelisting><IDOSummary /></IDOContextProvider>)}
    </SimpleGrid>
    <Heading>Finalized projects</Heading>
    <SimpleGrid columns={(endedProjects.length === 0) ? 1 : 3} spacing={8}>
      {endedProjects.length === 0 ? alert : null}
      {endedProjects.map(ido => <IDOContextProvider id={ido.id!} key={ido.id} whitelisting><IDOSummary /></IDOContextProvider>)}
    </SimpleGrid>
  </Stack>
}