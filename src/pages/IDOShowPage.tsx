import { Heading, Text, Stack, Tag, TagLabel, TagRightIcon } from "@chakra-ui/react";
import { CheckIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { FunctionComponent, useContext } from "react";
import { useParams } from "react-router-dom";
import { IDOContext, IDOContextProvider } from "../contexts/IDOContext";
import { TokenContext } from "../contexts/TokenContext";
import { IDOInteractComponent } from "../components/IDOInteractComponent";
import { CrowdsaleInformationComponent } from "../components/CrowdsaleInformationComponent";
import { IDOStatus } from "../utils/types";

let lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum magna ac faucibus interdum. Ut mollis diam quis urna pretium, at facilisis mauris lobortis. Nam ultrices iaculis commodo. Phasellus non augue dui. Aenean dictum sem sed diam commodo ultricies. Praesent elit lorem, tristique a aliquam dictum, tristique fringilla tortor. Sed mollis sapien quis dignissim malesuada. Cras vulputate felis ipsum, non aliquam nunc pulvinar ut. Duis ac ultrices sapien, et tristique ipsum. Integer odio massa, tempor in lobortis eget, ultrices pretium erat. Donec eu eros luctus, mollis purus sed, finibus neque. In ultrices, arcu ut posuere vestibulum, urna lectus pellentesque est, vel scelerisque justo dui in elit. Vivamus pulvinar, justo vel elementum gravida, elit mauris pharetra ipsum, in finibus eros massa et sapien. Aenean bibendum condimentum est at efficitur."

let maecenas = "Maecenas dignissim, felis non ultrices iaculis, mi mauris finibus ligula, at molestie felis elit vel felis. Mauris mi tortor, imperdiet bibendum porttitor ac, hendrerit id risus. Quisque rutrum maximus dignissim. Etiam aliquam elit quis mi tempor, vitae faucibus leo cursus. Mauris sed porttitor est. Donec vel tellus eget lacus dictum bibendum. Nunc fermentum magna sed lorem aliquam, ornare efficitur purus dapibus. Nulla vehicula, justo et fermentum egestas, nisl ligula sagittis augue, gravida sollicitudin felis metus at libero."

export const IDOShowPage: FunctionComponent = () => {
  let { tx } = useParams<{ tx: string }>();
  return <IDOContextProvider address={tx}>
    <IDOInformation />
  </IDOContextProvider>
}

const IDOInformation: FunctionComponent = () => {
  const { status } = useContext(IDOContext);
  const { name } = useContext(TokenContext);
  return <Stack spacing={8}>
    <Stack direction={"row"} spacing={2}>
      <Heading>XRand Online Game</Heading>
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
    <Stack direction={"row"} spacing={8}>
      <Stack spacing={8}>
        <Text>{lorem}</Text>
        <Text>{maecenas}</Text>
        <CrowdsaleInformationComponent />
      </Stack>
      <IDOInteractComponent />
    </Stack>

  </Stack >
}