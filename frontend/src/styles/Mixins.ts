import { ThemeValues } from "./Themes";

const DefaultFont = (fontSize: string) => `
  font-family: ${ThemeValues.commonFontFamily}, serif;
  font-weight: 300;

  font-size: ${fontSize};
`;

const BoldFont = (fontSize: string) => `
  font-family: ${ThemeValues.commonFontFamily}, serif;
  font-weight: bold;

  font-size: ${fontSize};
`;

const Avatar = (size: string) => `
  min-width: ${size};
  min-height: ${size};

  max-width: ${size};
  max-height: ${size};

  border-radius: 100%;

  background-position: center;
  background-size: cover;
`;

export { DefaultFont, BoldFont, Avatar };
