import { Stack, Grid2, Button } from "@mui/material";
import "./styles.scss";
import useTrigger from "@hooks/useTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import W2GLobby from "@type/W2GLobby";
import axios, { AxiosError } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import useProtected from "@hooks/useProtected";
import { useStores } from "appStoreContext";
import AuthState from "@type/AuthState";
import ServerError from "@type/ServerError";

const WatchTogetherMainPage: React.FC = () => {
  const { user } = useStores();

  useProtected();

  const lobbyNameInput = useRef<HTMLInputElement>(null);

  const { handler, trigger } = useTrigger();

  const [lobbys, setLobbys] = useState<W2GLobby[]>([]);
  const [createLobbyError, setCreateLobbyError] = useState("");

  useEffect(() => {
    axios.get(QueriesUrls.GET_W2G_LOBBYS).then((res) => {
      setLobbys(res.data);
    });
  }, [handler]);

  const createLobby = useCallback(() => {
    if (lobbyNameInput.current?.value === "") {
      setCreateLobbyError("У лобби долно быть название");
    }

    axios
      .post(QueriesUrls.W2G_LOBBYS_COMMON, null, {
        params: {
          lobbyName: lobbyNameInput.current?.value,
        },
      })
      .then(() => {})
      .catch((err: AxiosError) => {
        let srvErr = new ServerError(err.response?.data);

        setCreateLobbyError(srvErr.getFirstError());
      });
  }, [lobbyNameInput]);

  //if (user.status !== AuthState.Authed) return <></>;

  return (
    <Grid2 container spacing={2} marginTop={"16px"}>
      <Grid2 size={6}>
        <Stack spacing={2} className="w2g-createLobby">
          <Stack justifyContent={"center"} direction={"row"}>
            <h2>Создание лобби</h2>
          </Stack>
          <input
            ref={lobbyNameInput}
            type="text"
            className="w2g-createLobby__inputLobbyName"
            defaultValue={`${user.value?.name}\`s lobby`}
          />
          <Button variant="contained" color="primary" onClick={createLobby}>
            Создать
          </Button>
          {createLobbyError === "" && (
            <Stack justifyContent={"center"} direction={"row"}>
              <h5>{createLobbyError}</h5>
            </Stack>
          )}
        </Stack>
      </Grid2>
      <Grid2 size={6}>
        <Stack spacing={2} className="w2g-lobbyList">
          <Stack justifyContent={"center"} direction={"row"}>
            <h3>Список доступный лобби</h3>
          </Stack>
          <Stack spacing={1}>
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
};

export default WatchTogetherMainPage;
