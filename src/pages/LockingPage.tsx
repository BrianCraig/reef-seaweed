import { CircularProgress, Stack, Heading } from "@chakra-ui/react"
import { FunctionComponent } from "react"

const onLoading = <Stack spacing={8} alignItems={"center"} overflow={"hidden"}>
  <Heading>Loading Locking data</Heading>
  <CircularProgress isIndeterminate color={"app.400"} />
</Stack>

export const LockingPage: FunctionComponent = () => {
  return onLoading
}