import React from "react";
import { createRoot } from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import { App } from "./App";
import { theme } from "./theme";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: ${theme.bg};
    color: ${theme.text};
    font-family: "Manrope", "Avenir Next", "Segoe UI", sans-serif;
  }
  * { box-sizing: border-box; }
  button { font-family: inherit; }
`;

const root = createRoot(document.getElementById("root")!);
root.render(
    <>
        <GlobalStyle />
        <App />
    </>
);
