import { GlobalStyle } from "../styles/global";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles/theme";
import { Header } from "../components/Header";
import { CategoriesProvider } from "../contexts/CategoriesContext";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <CategoriesProvider>
        <Component {...pageProps} />
      </CategoriesProvider>
    </ThemeProvider>
  );
}

export default MyApp;
