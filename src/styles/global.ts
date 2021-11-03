import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }

    body, input, button, textarea {
        font-family: 'Lato', sans-serif;
    }

    .MuiTableCell-root{
        font-size: 1rem;
        padding: 6px 24px;
    }

    .MuiTableCell-head{
        font-weight: bold;
    }
`;
