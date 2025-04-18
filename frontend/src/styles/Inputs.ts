import { DefaultFont } from "./Mixins";
import { ThemeValues } from "./Themes";

const TextFieldMixin = () => `
  ${DefaultFont("14px")}

  font-weight: 500;

  resize: none;

  padding: ${ThemeValues.smallPadding};
  padding-left: 8px;

  border-radius: ${ThemeValues.smallBorderRadius};

  outline: none;

  border: solid 2px black;

  &:hover {
    outline: none;
  }

  &:focus {
    outline: solid 1px black;
  }
`;

export { TextFieldMixin };
