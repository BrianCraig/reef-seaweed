import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Heading, Link, Stack, Text } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

export const DocumentationPage = () => {
  return <Stack spacing={8}>
    <Heading>What is Seaweed</Heading>
    <Text fontSize={"xl"}>Seaweed is a initial DEX offering platform for the <Link href="https://reef.finance/" isExternal>Reef Chain <ExternalLinkIcon mx="2px" /></Link>, it offers <b>fast</b>, <b>cheap</b> and <b>scalable</b> transactions.</Text>
    <Text fontSize={"xl"}><b>Anyone can participate</b>, investing into new projects, and also publishing his own project, each project has it's own rules for who can participate, and how many coins can each investor get.</Text>
    <Heading>How can I apply on an IDO</Heading>
    <Text fontSize={"xl"}>You can apply on any IDO when it is open, you can see them in the <RouterLink to="/projects">Projects page</RouterLink> on the Open projects section, make sure you are whitelisted by locking your $SWD tokens in the <RouterLink to="/locking">Locking page</RouterLink>, and having enough of them. Every project defines how many tokens you need to have locked to start buying, so check theirs information section.</Text>
    <Text fontSize={"xl"}>You'll be able to obtain your new Tokens just after the sale ends, on the project page it will be available a Payout button for claiming your Tokens</Text>
    <Heading>How can i publish my own IDO</Heading>
    <Text fontSize={"xl"}>You can publish an ido at the <RouterLink to="/publish">Publish page</RouterLink>, there you should set all the parameters for your IDO, alongise the vesting of the Token, keep in mind that the Token is generated by the IDO contract, and is the solely owner and minter of this new Token, so make sure to review the IDO parameters first. Then you should be able to edit the description of the project on <RouterLink to="/my-account">My account page</RouterLink>.</Text>
  </Stack>
}