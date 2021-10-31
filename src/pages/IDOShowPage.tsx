import { Heading, Text, Stack, Tag, TagLabel, TagRightIcon } from "@chakra-ui/react";
import { CheckIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { FunctionComponent, useContext } from "react";
import { useParams } from "react-router-dom";
import { IDOContext, IDOContextProvider } from "../contexts/IDOContext";
import { IDOInteractComponent } from "../components/IDOInteractComponent";
import { CrowdsaleInformationComponent } from "../components/CrowdsaleInformationComponent";
import { IDOStatus } from "../utils/types";

export const IDOShowPage: FunctionComponent = () => {
  let { tx } = useParams<{ tx: string }>();
  return <IDOContextProvider address={tx}>
    <IDOInformation />
  </IDOContextProvider>
}

const IDOInformation: FunctionComponent = () => {
  const { status, ipfs } = useContext(IDOContext);

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