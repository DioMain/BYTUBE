import { Stack } from "@mui/material";
import { TextFieldMixin } from "@styles/Inputs";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const LobbyListItem = styled(Stack)`
  background-color: ${ThemeValues.commonBackColor};

  border-radius: ${ThemeValues.commonBorderRadius};

  padding: ${ThemeValues.commonPadding};
`;

const PasswordField = styled.input`
  ${TextFieldMixin()}
`;

export default { LobbyListItem, PasswordField };
