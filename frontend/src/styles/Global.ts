import styled, { createGlobalStyle } from "styled-components";
import { ThemeValues } from "./Themes";

const global = createGlobalStyle`
  * {
    margin: 0;

    font-family: ${ThemeValues.commonFontFamily};
  }

  body {
    background-color: ${ThemeValues.commonBackColor};
  }
`;

export default global;
