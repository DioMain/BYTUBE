import { useEffect, useState } from "react";
import w2gConnetion, { Start } from "@helpers/WatchTogetherService";
import axios from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";

function useW2GConnection(lobbyName: string) {
  const [connectionState, setConnetionState] = useState(w2gConnetion.state);

  useEffect(() => {
    axios
      .get(QueriesUrls.W2G_LOBBYS_TRY, {
        params: {
          lobbyName: lobbyName,
        },
      })
      .then(() => {
        Start()
          .then(() => {
            console.log("Connected to watch together system!");
            setConnetionState(w2gConnetion.state);
          })
          .catch((err) => {
            console.error(`Connetion to watch together is failed: ${err}`);
            setConnetionState(w2gConnetion.state);
          });
      })
      .catch(() => {
        window.location.assign(QueriesUrls.MAIN_PAGE);
      });
  }, []);

  return { w2gConnetion, connectionState };
}

export default useW2GConnection;
