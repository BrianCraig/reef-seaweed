import { CheckIcon } from "@chakra-ui/icons"
import { Avatar, Box, Heading, SimpleGrid, Stack, Tag, TagLabel, TagRightIcon, Text } from "@chakra-ui/react"

const IDOSummary = () => {
  return <Stack border={"1px"} borderColor={"app.400"} borderRadius={8} spacing={4} padding={4}>
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
      <Text>500,000 REEF</Text>
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
  return <Stack spacing={8}>
    <Heading>Open projects</Heading>
    <SimpleGrid columns={3} spacing={8}>
      <IDOSummary />
      <IDOSummary />
      <IDOSummary />
      <IDOSummary />
      <IDOSummary />
    </SimpleGrid>
  </Stack>
}