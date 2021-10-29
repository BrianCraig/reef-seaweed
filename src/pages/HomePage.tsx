import { Button, Heading, Stack, useColorMode } from "@chakra-ui/react"

export const HomePage = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return <Stack spacing={8}>
    <Heading>Home Page</Heading>
    <Button onClick={toggleColorMode}>
      Toggle {colorMode === "light" ? "Dark" : "Light"}
    </Button>
  </Stack>
}