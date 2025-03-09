import VideoPlayer from "@components/VideoPlayer";
import { Stack } from "@mui/material";
import { useStores } from "appStoreContext";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import "./styles.scss";
import useW2GConnection from "@hooks/useW2GConnetion";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthState from "@type/AuthState";
import { HubConnectionState } from "@microsoft/signalr";
import ReactPlayer from "react-player";
import { VideoPlayerRef } from "@components/VideoPlayer/types";

const W2GWatchPage: React.FC = observer(() => {
  const params = useSearchParams();
  const lobbyName = params[0].get("lobby") as string;

  const navigator = useNavigate();

  const player = useRef<VideoPlayerRef>(null);

  const { w2gConnetion, connectionState } = useW2GConnection();

  const [videoUrl, setVideoUrl] = useState<string | null>(
    "/data/videos/110b9e86-54d9-4063-b7fa-517695335c7d/video.mp4"
  );

  const [isReady, setReady] = useState(false);

  const { user } = useStores();

  function isVideoPlaying() {
    return !player.current?.getPlayer().paused && !player.current?.getPlayer().ended;
  }

  useEffect(() => {
    player.current?.setControls(isReady);
  }, [isReady]);

  useEffect(() => {
    w2gConnetion.on("onPlay", () => {
      console.log("remote: play");
      player.current?.playNotNotify();
    });

    w2gConnetion.on("onPause", () => {
      console.log("remote: pause");
      player.current?.pauseNotNotify();
    });

    w2gConnetion.on("onSeek", (time) => {
      console.log("remote: seek");
      player.current?.seekNotNotify(time);
    });

    w2gConnetion.on("onSync", (time, isPlay) => {
      console.log("remote: sync");
      player.current?.seekNotNotify(time);
      console.log(isPlay);
      if (isPlay) {
        player.current?.playNotNotify();
      } else {
        player.current?.pauseNotNotify();
      }
    });

    w2gConnetion.on("onRequestSync", () => {
      console.log("remote: sync request");
      w2gConnetion.invoke("Sync", player.current?.getTime(), isVideoPlaying());
    });

    return () => {
      w2gConnetion.off("onPlay");
      w2gConnetion.off("onPause");
      w2gConnetion.off("onSeek");
      w2gConnetion.off("onSync");
      w2gConnetion.off("onRequestSync");
    };
  }, []);

  useEffect(() => {
    if (user.status === AuthState.Authed && connectionState === HubConnectionState.Connected) {
      w2gConnetion.invoke("JoinToLobby", lobbyName);
    } else if (user.status === AuthState.NotAuthed) {
      navigator("/App/Main");
    }
  }, [user.status, connectionState]);

  const onPlayHandle = () => {
    w2gConnetion.invoke("Play");
  };

  const onPauseHandle = () => {
    w2gConnetion.invoke("Pause");
  };

  const onSeekHandle = () => {
    w2gConnetion.invoke("Seek", player.current?.getTime());
  };

  const onReadyHandle = () => {
    if (!isReady) {
      console.log("ready");
      w2gConnetion.invoke("RequestSync");
      setReady(true);
    }
  };

  return (
    <Stack className="w2g">
      <Stack direction={"row"} className="w2g-video">
        {videoUrl && (
          <VideoPlayer
            url={videoUrl}
            width={`480px`}
            ref={player}
            onPlay={onPlayHandle}
            onPause={onPauseHandle}
            onSeek={onSeekHandle}
            onReady={onReadyHandle}
          />
        )}
      </Stack>
    </Stack>
  );
});

export default W2GWatchPage;
