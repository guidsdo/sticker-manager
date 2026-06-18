import React from "react";
import { createRoot } from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import { App } from "./App";
import { theme } from "./theme";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background:
      radial-gradient(circle at 22% 8%, rgba(0, 201, 120, 0.26), transparent 30%),
      radial-gradient(circle at 78% 14%, rgba(255, 47, 69, 0.28), transparent 34%),
      radial-gradient(circle at 50% 0%, rgba(10, 132, 255, 0.22), transparent 38%),
      ${theme.bg};
    color: ${theme.text};
    font-family: "Fira Sans", "Avenir Next", "Segoe UI", sans-serif;
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
