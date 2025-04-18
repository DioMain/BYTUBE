import { Stack } from "@mui/material";
import { TextFieldMixin } from "@styles/Inputs";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const ChannelControll = styled(Stack)`
  padding-left: 32px;
  padding-right: 32px;
`;

const SearchInput = styled(Stack)`
  margin-top: 16px;

  input {
    ${TextFieldMixin()}
  }
`;

export default {
  ChannelControll,
  SearchInput,
};
