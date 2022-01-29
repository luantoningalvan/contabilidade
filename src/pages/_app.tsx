import { CategoriesProvider } from "../contexts/CategoriesContext";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <CategoriesProvider>
        <Component {...pageProps} />
      </CategoriesProvider>
    </ChakraProvider>
  );
}

export default MyApp;
