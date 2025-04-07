import { Stack } from "@mui/system";
import { TextFieldMixin } from "@styles/Inputs";
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

export default {
  WatchTogether,
  CreateLobby,

  InputLobbyName,
  InputLobbyPassword,

  LobbyList,
};
