import { Heading, Text, Stack, Tag, TagLabel, TagRightIcon, Box, Button, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Tab, TabList, TabPanel, TabPanels, Tabs, Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";
import { ArrowRightIcon, CheckIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { FunctionComponent, useContext } from "react";
import { useParams } from "react-router-dom";
import { IDOContext, IDOContextProvider, IDOStatus } from "../contexts/IDOContext";

let lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum magna ac faucibus interdum. Ut mollis diam quis urna pretium, at facilisis mauris lobortis. Nam ultrices iaculis commodo. Phasellus non augue dui. Aenean dictum sem sed diam commodo ultricies. Praesent elit lorem, tristique a aliquam dictum, tristique fringilla tortor. Sed mollis sapien quis dignissim malesuada. Cras vulputate felis ipsum, non aliquam nunc pulvinar ut. Duis ac ultrices sapien, et tristique ipsum. Integer odio massa, tempor in lobortis eget, ultrices pretium erat. Donec eu eros luctus, mollis purus sed, finibus neque. In ultrices, arcu ut posuere vestibulum, urna lectus pellentesque est, vel scelerisque justo dui in elit. Vivamus pulvinar, justo vel elementum gravida, elit mauris pharetra ipsum, in finibus eros massa et sapien. Aenean bibendum condimentum est at efficitur."

let maecenas = "Maecenas dignissim, felis non ultrices iaculis, mi mauris finibus ligula, at molestie felis elit vel felis. Mauris mi tortor, imperdiet bibendum porttitor ac, hendrerit id risus. Quisque rutrum maximus dignissim. Etiam aliquam elit quis mi tempor, vitae faucibus leo cursus. Mauris sed porttitor est. Donec vel tellus eget lacus dictum bibendum. Nunc fermentum magna sed lorem aliquam, ornare efficitur purus dapibus. Nulla vehicula, justo et fermentum egestas, nisl ligula sagittis augue, gravida sollicitudin felis metus at libero."

export const IDOShowPage: FunctionComponent = () => {
  let { tx } = useParams<{ tx: string }>();
  return <IDOContextProvider address={tx}>
    <IDOInformation />
  </IDOContextProvider>
}

const IDOInformation: FunctionComponent = () => {
  const { information, status } = useContext(IDOContext);
  return <Stack spacing={4}>
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
    <Text>{lorem}</Text>
    <Text>{maecenas}</Text>
    <Box borderRadius="md" borderColor={"reef.dark"} borderWidth={"2px"} w={480} alignSelf={"center"} display={"flex"} flexDirection={"column"} padding={2} boxSizing={"border-box"}>
      <Stack spacing={2} >
        <Stack direction={"row"}>
          <Button bg={"reef.lighter"} width={"50%"} selected>Buy</Button>
          <Button bg={"reef.lighter"} width={"50%"} disabled>Withdraw</Button>
        </Stack>
        <Stat alignSelf={"center"}>
          <StatLabel>Bought</StatLabel>
          <StatNumber>0 XCR</StatNumber>
        </Stat>
        <Stack direction={"row"} alignItems={"center"}>
          <NumberInput defaultValue={15} precision={3} step={1}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text flexShrink={0}>REEF <ArrowRightIcon /> XCM</Text>
          <NumberInput defaultValue={15} precision={3} step={1}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Stack>
        <Button bg={"reef.lighter"}>Buy</Button>
        <Button bg={"reef.lighter"} disabled>Opens in 53s</Button>
      </Stack>
    </Box >
  </Stack >
}