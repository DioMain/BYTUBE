import VideoPlayer from "@components/VideoPlayer";
import { Stack } from "@mui/material";
import { useStores } from "appStoreContext";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import "./styles.scss";
import useW2GConnection from "@hooks/useW2GConnetion";
import { useSearchParams } from "react-router-dom";
import AuthState from "@type/AuthState";
import { HubConnectionState } from "@microsoft/signalr";

const W2GWatchPage: React.FC = observer(() => {
  const params = useSearchParams();
  const lobbyName = params[0].get("lobby") as string;

  const { w2gConnetion, connectionState } = useW2GConnection();

  const [videoUrl, setVideoUrl] = useState<string | null>(
    "/data/videos/110b9e86-54d9-4063-b7fa-517695335c7d/video.mp4"
  );

  const { user } = useStores();

  useEffect(() => {
    if (user.status === AuthState.Authed && connectionState === HubConnectionState.Connected) {
      w2gConnetion.invoke("JoinToLobby", lobbyName);
    }
  }, [user.status, connectionState]);

  return (
    <Stack className="w2g">
      <Stack direction={"row"} className="w2g-video">
        {videoUrl && <VideoPlayer url={videoUrl} width="800px" />}
      </Stack>
    </Stack>
  );
});

export default W2GWatchPage;
