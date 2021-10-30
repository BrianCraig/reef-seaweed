import { CheckIcon } from "@chakra-ui/icons"
import { Avatar, Box, CircularProgress, Heading, SimpleGrid, Stack, Tag, TagLabel, TagRightIcon, Text } from "@chakra-ui/react"
import { utils } from "ethers";
import { FunctionComponent, useContext } from "react"
import { useHistory } from "react-router";
import { ContractsContext } from "../contexts/ContractsContext"
import { FullIDOInfo, IDOStatus } from "../utils/types"
import { timestampToStatus } from "../utils/utils"

const IDOSummary: FunctionComponent<{ info: FullIDOInfo }> = ({ info: { info, address } }) => {
  let { push } = useHistory();
  return <Stack border={"1px"} borderColor={"app.400"} borderRadius={8} spacing={4} padding={4} onClick={() => push(`/ido/${address}`)}>
    <Stack direction={"row"} spacing={4}>
      <Avatar size={"md"} name="Y K" />
      <Stack justifyContent={"space-between"} spacing={0}>
        <Heading size={"md"}>Project title</Heading>
        <Text>Project subtitle</Text>
      </Stack>
    </Stack>
    <Box borderTop={"1px"} borderBottom={"1px"} borderColor={"app.600"} bg={"app.100"}>
      <Stack width={"100%"} bg={"app.600"} height={140} padding={2} direction={"row"} alignItems={"flex-start"} justifyContent={"flex-end"}>
        <Tag variant="solid" >
          <TagLabel>Blue</TagLabel>
          <TagRightIcon as={CheckIcon} />
        </Tag>
      </Stack>
    </Box>
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Text>Raise goal</Text>
      <Text>{utils.formatEther(info.maxSoldBaseAmount)} REEF</Text>
    </Stack>
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Text>Max allocation</Text>
      <Text>1,000 REEF</Text>
    </Stack>
    <Box border={"1px"} borderColor={"app.600"} borderRadius={8} bg={"app.100"}>
      <Box width={"33%"} bg={"app.600"} height={2} />
    </Box>
  </Stack >
}

export const ProjectsPage = () => {
  let { IDOInfoMap, IDOInfoMapLoading } = useContext(ContractsContext);

  if (IDOInfoMapLoading || IDOInfoMap === undefined) return <Stack spacing={8} alignItems={"center"} overflow={"hidden"}>
    <Heading>Loading Projects</Heading>
    <CircularProgress isIndeterminate color={"app.400"} />
  </Stack>

  let pendingProjects = IDOInfoMap.filter(e => timestampToStatus(e.info) === IDOStatus.Pending)
  let openProjects = IDOInfoMap.filter(e => timestampToStatus(e.info) === IDOStatus.Open)
  let endedProjects = IDOInfoMap.filter(e => timestampToStatus(e.info) === IDOStatus.Ended)

  return <Stack spacing={8}>
    <Heading>Open projects</Heading>
    <SimpleGrid columns={3} spacing={8}>
      {openProjects.map(info => <IDOSummary key={info.address} info={info} />)}
    </SimpleGrid>
    <Heading>Upcoming projects</Heading>
    <SimpleGrid columns={3} spacing={8}>
      {pendingProjects.map(info => <IDOSummary key={info.address} info={info} />)}
    </SimpleGrid>
    <Heading>Finalized projects</Heading>
    <SimpleGrid columns={3} spacing={8}>
      {endedProjects.map(info => <IDOSummary key={info.address} info={info} />)}
    </SimpleGrid>
  </Stack>
}