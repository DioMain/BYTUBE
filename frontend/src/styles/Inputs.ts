import { DefaultFont } from "./Mixins";

const TextFieldMixin = () => `
  color: black;

  ${DefaultFont("14px")}

  font-weight: 500;

  resize: none;

  padding: 8px;
  padding-left: 12px;

  border-radius: 6px;

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
