import { Heading, Text, Stack, Tag, TagLabel, TagRightIcon, CircularProgress, Image } from "@chakra-ui/react";
import { CheckIcon, LockIcon } from "@chakra-ui/icons";
import { FunctionComponent, useContext } from "react";
import { useParams } from "react-router-dom";
import { IDOInteractContext, IDOInteractContextProvider } from "../contexts/IDOInteractContext";
import { IDOInteractComponent } from "../components/IDOInteractComponent";
import { CrowdsaleInformationComponent } from "../components/CrowdsaleInformationComponent";
import { IDOStatus } from "../utils/types";
import { IDOContext, IDOContextProvider } from "../contexts/IDOContext";
import { VestingInformationComponent } from "../components/VestingInformationComponent";

const onLoading = <Stack spacing={8} alignItems={"center"} overflow={"hidden"}>
  <Heading>Loading IDO</Heading>
  <CircularProgress isIndeterminate color={"app.400"} />
</Stack>

export const IDOShowPage: FunctionComponent = () => {
  let { tx } = useParams<{ tx: string }>();
  return <IDOContextProvider id={parseInt(tx, 10)} onLoading={onLoading} loadVesting whitelisting>
    <IDOInteractContextProvider>
      <IDOInformation />
    </IDOInteractContextProvider>
  </IDOContextProvider>
}

let whitelistedEl = <Tag alignSelf={"flex-start"} size="sm" variant="outline">
  <TagLabel>Whitelisted</TagLabel>
  <TagRightIcon as={CheckIcon} />
</Tag>

let whitelistedntEl = <Tag alignSelf={"flex-start"} size="sm" variant="outline" colorScheme="red">
  <TagLabel>Not whitelisted</TagLabel>
  <TagRightIcon as={LockIcon} />
</Tag>

const IDOInformation: FunctionComponent = () => {
  const { whitelisted, ipfs } = useContext(IDOContext)
  const { status } = useContext(IDOInteractContext)

  return <Stack spacing={8}>
    <Stack>
      <Stack direction={"row"} spacing={8}>
        <Image height={"70px"} src={`https://ipfs.infura.io/ipfs/${ipfs.logo}`} alt="Project logo" />
        <Stack spacing={2}>
          <Stack direction={"row"} spacing={2}>
            <Heading>{ipfs.title}</Heading>
            <Text>{status !== undefined && IDOStatus[status]}</Text>
            {whitelisted !== undefined && (whitelisted ? whitelistedEl : whitelistedntEl)}
          </Stack>
          <Heading size={"sm"}>{ipfs.subtitle}</Heading>
        </Stack>

      </Stack>
    </Stack>
    <Stack direction={"row"} spacing={8}>
      <Stack spacing={8}>
        <Image src={`https://ipfs.infura.io/ipfs/${ipfs.background}`} />
        <Text whiteSpace={"break-spaces"}>{ipfs.description}</Text>
        <Heading size={"lg"}>IDO Rules</Heading>
        <CrowdsaleInformationComponent />
        <Heading size={"lg"}>Vesting</Heading>
        <VestingInformationComponent />
      </Stack>
      <IDOInteractComponent />
    </Stack>

  </Stack >
}