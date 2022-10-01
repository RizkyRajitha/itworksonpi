import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
});

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
