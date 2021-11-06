import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Heading, Link, Stack, Text } from "@chakra-ui/react"

export const DocumentationPage = () => {
  return <Stack spacing={8}>
    <Heading>What is Seaweed</Heading>
    <Text fontSize={"xl"}>Seaweed is a initial DEX offering platform for the <Link href="https://reef.finance/" isExternal>Reef Chain <ExternalLinkIcon mx="2px" /></Link>, it offers <b>fast</b>, <b>cheap</b> and <b>scalable</b> transactions.</Text>
    <Text fontSize={"xl"}><b>Anyone can participate</b>, investing into new projects, and also publishing his own project, each project has it's own rules for who can participate, and how many coins can each investor get.</Text>
    <Heading></Heading>
  </Stack>
}