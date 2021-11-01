import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react"

const nunito = "'Nunito', sans-serif";
const space = "'Space Grotesk', sans-serif";

export const appTheme = extendTheme({
  fonts: {
    heading: space,
    body: nunito,
    mono: nunito
  },
  colors: {
    app:
    {
      50: '#f8e3ff',
      100: '#deb2ff',
      200: '#c87fff',
      300: '#b14cff',
      400: '#9a1aff',
      500: '#8100e6',
      600: '#6400b4',
      700: '#470082',
      800: '#2b0050',
      900: '#100020',
    }
  }
},
  withDefaultColorScheme({ colorScheme: "app" })
)