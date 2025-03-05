import { useEffect, useState } from "react";
import w2gConnetion, { Start } from "@helpers/WatchTogetherService";

function useW2GConnection() {
  const [connectionState, setConnetionState] = useState(w2gConnetion.state);

  useEffect(() => {
    Start()
      .then(() => {
        console.log("Connected to watch together system!");
        setConnetionState(w2gConnetion.state);
      })
      .catch((err) => {
        console.error(`Connetion to watch together is failed: ${err}`);
        setConnetionState(w2gConnetion.state);
      });
  }, []);

  return { w2gConnetion, connectionState };
}

export default useW2GConnection;
