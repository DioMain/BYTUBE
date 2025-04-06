import { Stack } from "@mui/system";
import { TextFieldMixin } from "@styles/Inputs";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const WatchTogether = styled(Stack)``;

const CreateLobby = styled(Stack)`
  margin-left: 20%;
  margin-right: 20%;
`;

const InputLobbyName = styled.input`
  ${TextFieldMixin()}
`;

const InputLobbyPassword = styled.input`
  ${TextFieldMixin()}
`;

const LobbyList = styled(Stack)``;

const LobbyListItem = styled(Stack)`
  background-color: ${ThemeValues.commonBackColor};

  border-radius: ${ThemeValues.commonBorderRadius};

  padding: ${ThemeValues.commonPadding};
`;

export default {
  WatchTogether,
  CreateLobby,

  InputLobbyName,
  InputLobbyPassword,

  LobbyList,
  LobbyListItem,
};
