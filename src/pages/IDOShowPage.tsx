import { Heading, Text, Stack, Tag, TagLabel, TagRightIcon, CircularProgress } from "@chakra-ui/react";
import { CheckIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { FunctionComponent, useContext } from "react";
import { useParams } from "react-router-dom";
import { IDOInteractContext, IDOInteractContextProvider } from "../contexts/IDOInteractContext";
import { IDOInteractComponent } from "../components/IDOInteractComponent";
import { CrowdsaleInformationComponent } from "../components/CrowdsaleInformationComponent";
import { IDOStatus } from "../utils/types";
import { IDOContextProvider } from "../contexts/IDOContext";

const onLoading = <Stack spacing={8} alignItems={"center"} overflow={"hidden"}>
  <Heading>Loading IDO</Heading>
  <CircularProgress isIndeterminate color={"app.400"} />
</Stack>

export const IDOShowPage: FunctionComponent = () => {
  let { tx } = useParams<{ tx: string }>();
  return <IDOContextProvider id={parseInt(tx, 10)} onLoading={onLoading}>
    <IDOInteractContextProvider>
      <IDOInformation />
    </IDOInteractContextProvider>
  </IDOContextProvider>
}

const IDOInformation: FunctionComponent = () => {
  const { status, ipfs } = useContext(IDOInteractContext);

  return <Stack spacing={8}>
    <Stack>
      <Stack direction={"row"} spacing={2}>
        <Heading>{ipfs?.title}</Heading>
        <Text>{status !== undefined && IDOStatus[status]}</Text>
        <Tag alignSelf={"flex-start"} size="sm" variant="outline" colorScheme="blue">
          <TagLabel>Can Buy</TagLabel>
          <TagRightIcon as={CheckIcon} />
        </Tag>
        <Tag alignSelf={"flex-start"} size="sm" variant="outline" colorScheme="red">
          <TagLabel>Contract Not Verified</TagLabel>
          <TagRightIcon as={InfoOutlineIcon} />
        </Tag>
      </Stack>
      <Heading size={"sm"}>{ipfs?.subtitle}</Heading>
    </Stack>
    <Stack direction={"row"} spacing={8}>
      <Stack spacing={8}>
        <Text>{ipfs?.description}</Text>
        <CrowdsaleInformationComponent />
      </Stack>
      <IDOInteractComponent />
    </Stack>

  </Stack >
}