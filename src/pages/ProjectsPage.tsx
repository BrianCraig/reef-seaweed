import { Avatar, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"

const IDOSummary = () => {
  return <Stack border={"1px"} borderColor={"app.400"} borderRadius={8} bg="app.50" spacing={2} padding={4}>
    <Stack direction={"row"} spacing={4}>
      <Avatar size={"md"} name="Y K" />
      <Stack justifyContent={"space-between"} spacing={0}>
        <Heading size={"md"}>Project title</Heading>
        <Text>Project subtitle</Text>
      </Stack>
    </Stack>
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