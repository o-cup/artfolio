import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};

  @font-face {
    font-family: "SunBatang";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_eight@1.0/SunBatang-Light.woff") format("woff");
    font-weight: 400;
    font-style: normal;
    unicode-range: U+AC00-D7A3;
  }

  @font-face {
    font-family: "SunBatang";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_eight@1.0/SunBatang-Bold.woff") format("woff");
    font-weight: 700;
    font-style: normal;
    unicode-range: U+AC00-D7A3;
  }

  html, body {
    font-family: "SunBatang","Quattrocento", serif;
    padding: 0;
    margin: 0;
    background-color: #f0f0ef;
    scroll-behavior: auto;
  }

    *, *::before, *::after {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    font-family: "SunBatang", "Quattrocento", serif;
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
