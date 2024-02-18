import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};
  
  html {
    scroll-behavior: auto;
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    font-family: "Quattrocento", serif;
    padding: 0;
    margin: 0;
  }

  input, textarea, select {
    outline: 0;
  }
  
  select {
    -webkit-appearance: none;
		-moz-appearance: none;
  }

  button {
    margin: 0;
    padding: 0;
    border: 0;
    cursor: pointer;
  }
`;

export default GlobalStyle;
