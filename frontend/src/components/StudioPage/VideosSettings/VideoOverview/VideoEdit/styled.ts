import { TextFieldMixin } from "@styles/Inputs";
import styled from "styled-components";

const VideoNameInput = styled.input`
  ${TextFieldMixin()}

  width: 30%;
`;

const VideoDescriptionTextArea = styled.textarea`
  ${TextFieldMixin()}
`;

const VideoTagInput = styled.input`
  ${TextFieldMixin()}
`;

export default {
  VideoNameInput,
  VideoDescriptionTextArea,
  VideoTagInput,
};
