import { extendTheme } from "@chakra-ui/react"

const nunito = "'Nunito', sans-serif";
const space = "'Space Grotesk', sans-serif";

export const appTheme = extendTheme({
  fonts: {
    heading: space,
    body: nunito,
    mono: nunito
  }
})