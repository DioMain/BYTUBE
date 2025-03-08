import { Stack, Grid2, Button } from "@mui/material";
import useTrigger from "@hooks/useTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import W2GLobby from "@type/W2GLobby";
import axios, { AxiosError } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import useProtected from "@hooks/useProtected";
import { useStores } from "appStoreContext";
import ServerError from "@type/ServerError";
import "./styles.scss";
import AuthState from "@type/AuthState";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const W2GMainPage: React.FC = observer(() => {
  useProtected();

  const navigator = useNavigate();

  const lobbyNameInput = useRef<HTMLInputElement>(null);

  const { handler, trigger } = useTrigger();

  const [lobbys, setLobbys] = useState<W2GLobby[]>([]);
  const [createLobbyError, setCreateLobbyError] = useState("");

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

    axios
      .post(QueriesUrls.W2G_LOBBYS_COMMON, null, {
        params: {
          lobbyName: lobbyNameInput.current?.value,
        },
      })
      .then(() => {
        navigator(`/App/WatchTogether/Lobby?lobby=${lobbyNameInput.current?.value}`);
      })
      .catch((err: AxiosError) => {
        let srvErr = new ServerError(err.response?.data);

        setCreateLobbyError(srvErr.getFirstError());
      });
  }, [lobbyNameInput]);

  if (user.status === AuthState.Loading) return <></>;

  return (
    <Grid2 container spacing={2} marginTop={"16px"} justifyContent={"center"}>
      <Grid2 size={6} minWidth={"390px"}>
        <Stack spacing={2} className="w2g-createLobby">
          <Stack justifyContent={"center"} direction={"row"}>
            <h2>Создание лобби</h2>
          </Stack>
          <input
            ref={lobbyNameInput}
            type="text"
            className="w2g-createLobby__inputLobbyName"
            defaultValue={`${user.value?.name}\`s lobby`}
            placeholder="Название лобби"
          />
          <Button variant="contained" color="primary" onClick={createLobby}>
            Создать
          </Button>
          {createLobbyError !== "" && (
            <Stack justifyContent={"center"} direction={"row"} color={"red"}>
              <h5>{createLobbyError}</h5>
            </Stack>
          )}
        </Stack>
      </Grid2>
      <Grid2 size={6} minWidth={"390px"}>
        <Stack spacing={2} className="w2g-lobbyList">
          <Stack justifyContent={"center"} direction={"row"}>
            <h3>Список доступный лобби</h3>
          </Stack>
          <Stack spacing={1} className="w2g-lobbyList-list">
            {lobbys.map((lobby) => {
              return (
                <Stack className="w2g-lobbyList-item">
                  <h5>{lobby.name}</h5>
                  <Button variant="contained" color="primary">
                    Присоедениться
                  </Button>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </Grid2>
    </Grid2>
  );
});

export default W2GMainPage;
