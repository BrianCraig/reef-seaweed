import { extendTheme } from "@chakra-ui/react"

const nunito = "'Nunito', sans-serif";
const space = "'Space Grotesk', sans-serif";

export const appTheme = extendTheme({
  fonts: {
    heading: space,
    body: nunito,
    mono: nunito
  },
  colors: {
    reef: {
      base: "#8F00FF",
      dark: "#5D00A4",
      darker: "#34005B",
      light: "#B85BFF",
      lighter: "#D8A4FF",
      hueneg: "#0D00FF",
      huenegneg: "#0076FF",
      huepos: "#FF00EA",
      huepospos: "#FF0067",
      complementary: "#6EFF00",
      error: "#FF006E"
    }
  }
})