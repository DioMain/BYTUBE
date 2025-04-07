import { Stack, Grid2, Button, LinearProgress, FormControlLabel, Checkbox, Tooltip } from "@mui/material";
import useTrigger from "@hooks/useTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import W2GLobby from "@type/W2GLobby";
import axios, { AxiosError } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import useProtected from "@hooks/useProtected";
import { useStores } from "appStoreContext";
import ServerError from "@type/ServerError";
import AuthState from "@type/AuthState";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import styles from "./styled";
import LobbyItem from "./LobbyItem";

const W2GMainPage: React.FC = observer(() => {
  useProtected();

  const navigator = useNavigate();

  const lobbyNameInput = useRef<HTMLInputElement>(null);
  const lobbyPasswordInput = useRef<HTMLInputElement>(null);

  const { handler, trigger } = useTrigger();

  const [lobbys, setLobbys] = useState<W2GLobby[]>([]);
  const [createLobbyError, setCreateLobbyError] = useState("");

  const [isPrivateLobby, setIsPrivateLobby] = useState(false);

  const { user } = useStores();

  useEffect(() => {
    axios.get(QueriesUrls.GET_W2G_LOBBYS).then((res) => {
      setLobbys(res.data);
    });
  }, [handler]);

  const createLobby = useCallback(() => {
    if (lobbyNameInput.current?.value === "") {
      setCreateLobbyError("У лобби долно быть название");
      return;
    }

    if (lobbyPasswordInput.current?.value === "" && isPrivateLobby) {
      setCreateLobbyError("Пароль для лобби должен быть указан");
      return;
    }

    axios
      .post(QueriesUrls.W2G_LOBBYS_COMMON, {
        Name: lobbyNameInput.current?.value,
        Password: isPrivateLobby ? lobbyPasswordInput.current?.value : null,
      })
      .then(() => {
        navigator(`/App/WatchTogether/Lobby?lobby=${lobbyNameInput.current?.value}`);
      })
      .catch((err: AxiosError) => {
        let srvErr = new ServerError(err.response?.data);

        setCreateLobbyError(srvErr.getFirstError());
      });
  }, [lobbyNameInput, isPrivateLobby]);

  const connectToLobby = (lobby: W2GLobby) => {
    navigator(`/App/WatchTogether/Lobby?lobby=${lobby.name}`);
  };

  if (user.status === AuthState.Loading) return <LinearProgress></LinearProgress>;

  return (
    <Grid2 container spacing={2} margin={"16px"} justifyContent={"center"}>
      <Grid2 size={6} minWidth={"380px"}>
        <styles.CreateLobby spacing={2}>
          <Stack justifyContent={"center"} direction={"row"}>
            <h2>Создание комнаты</h2>
          </Stack>
          <styles.InputLobbyName
            ref={lobbyNameInput}
            type="text"
            defaultValue={`${user.value?.name}\`s lobby`}
            placeholder="Название комнаты"
          />
          <Stack direction={"row"} justifyContent={"space-between"}>
            <styles.InputLobbyPassword
              ref={lobbyPasswordInput}
              type="text"
              placeholder="Пароль"
              disabled={!isPrivateLobby}
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={isPrivateLobby}
                  onChange={(evt) => setIsPrivateLobby(evt.currentTarget.checked)}
                />
              }
              label="Приватная?"
            />
          </Stack>
          <Button variant="contained" color="primary" onClick={createLobby}>
            Создать
          </Button>
          {createLobbyError !== "" && (
            <Stack justifyContent={"center"} direction={"row"} color={"red"}>
              <h5>{createLobbyError}</h5>
            </Stack>
          )}
        </styles.CreateLobby>
      </Grid2>
      <Grid2 size={6} minWidth={"380px"}>
        <styles.LobbyList spacing={2}>
          <Stack justifyContent={"center"} direction={"row"}>
            <h3>Список доступных комнат</h3>
          </Stack>
          <Stack spacing={1} className="w2g-lobbyList-list">
            {lobbys.map((lobby, index) => {
              return <LobbyItem lobby={lobby} key={`lobby-item-${index}`} onConnectClick={connectToLobby} />;
            })}
          </Stack>
        </styles.LobbyList>
      </Grid2>
    </Grid2>
  );
});

export default W2GMainPage;
