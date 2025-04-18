import { TextFieldMixin } from "@styles/Inputs";
import styled from "styled-components";

const NameInput = styled.input`
  ${TextFieldMixin()}

  width: 100%;
`;

export default {
  NameInput,
};
