import { Button, Stack, Tooltip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import styles from "./styled";
import W2GLobby from "@type/W2GLobby";
import { useCallback, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import { useNavigate } from "react-router-dom";
import ServerError from "@type/ServerError";

interface LobbyItemProps {
  lobby: W2GLobby;

  onConnectClick: (lobby: W2GLobby) => void;
}

const LobbyItem: React.FC<LobbyItemProps> = ({ lobby, onConnectClick }) => {
  const navigator = useNavigate();

  const passwordField = useRef<HTMLInputElement>(null);

  const [needPassword, setNeedPassword] = useState(false);
  const [error, setError] = useState("");

  const onConnectClickHandle = useCallback(() => {
    if (needPassword) {
      axios
        .post(QueriesUrls.W2G_LOBBYS_PASS, {
          Name: lobby.name,
          Password: passwordField.current?.value,
        })
        .then(() => {
          onConnectClick(lobby);
        })
        .catch(() => {
          setError("Не верный пароль!");
        });
    } else {
      axios
        .get(QueriesUrls.W2G_LOBBYS_TRY, {
          params: {
            lobbyName: lobby.name,
          },
        })
        .then(() => {
          onConnectClick(lobby);
        })
        .catch((error: AxiosError) => {
          const serverErr = new ServerError(error);

          if (serverErr.status === 403) {
            setNeedPassword(true);
          } else {
            navigator("/App/Main");
          }
        });
    }
  }, [lobby, needPassword, passwordField]);

  return (
    <styles.LobbyListItem direction={"row"} justifyContent={"space-between"}>
      <Stack spacing={2}>
        <h4>{lobby.name}</h4>
        <Stack direction={"row"} spacing={2}>
          <div>Пользователей: {lobby.usersCount}</div>
          {lobby.isPrivate && (
            <Tooltip title="Приватная комната">
              <LockIcon />
            </Tooltip>
          )}
        </Stack>
      </Stack>
      <Stack spacing={1}>
        <Button variant="contained" color="primary" onClick={onConnectClickHandle}>
          Присоедениться
        </Button>
        {needPassword && <styles.PasswordField type="password" placeholder="Пароль..." ref={passwordField} />}
      </Stack>
    </styles.LobbyListItem>
  );
};

export default LobbyItem;
