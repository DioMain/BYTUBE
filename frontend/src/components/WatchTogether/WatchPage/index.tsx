import VideoPlayer from "@components/VideoPlayer";
import { Alert, Stack, Container } from "@mui/material";
import { useStores } from "appStoreContext";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.scss";
import useW2GConnection from "@hooks/useW2GConnetion";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthState from "@type/AuthState";
import { HubConnectionState } from "@microsoft/signalr";
import { VideoPlayerRef } from "@components/VideoPlayer/types";
import W2GLobby from "@type/W2GLobby";
import axios from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import VideoModel from "@type/models/VideoModel";
import SelectVideoModal from "./SelectVideoModal";
import MarkVideo from "@components/VideoPage/MarkVideo";

const W2GWatchPage: React.FC = observer(() => {
  const params = useSearchParams();
  const lobbyName = params[0].get("lobby") as string;

  const navigator = useNavigate();

  const player = useRef<VideoPlayerRef>(null);

  const { w2gConnetion, connectionState } = useW2GConnection(lobbyName);

  const [video, setVideo] = useState<VideoModel | null>(null);
  const [lobbyData, setLobbyData] = useState<W2GLobby | null>(null);
  const [isReady, setReady] = useState(false);
  const [selectVideoOpened, setSelectVideoOpened] = useState(false);

  const { user } = useStores();

  const getLobbyData = useCallback(() => {
    if (connectionState !== HubConnectionState.Connected) return;

    axios
      .get(QueriesUrls.W2G_LOBBYS_COMMON, {
        params: {
          lobbyName: lobbyName,
        },
      })
      .then((res) => {
        const lobby = res.data as W2GLobby;

        if (lobby.videoId === null) {
          setVideo(null);
        } else if (video === null || lobby.videoId !== video.id) {
          getFullVideo(lobby.videoId);
        }

        setLobbyData(lobby);
      });
  }, [connectionState]);

  const getFullVideo = useCallback(
    (videoId: string) => {
      axios
        .get(QueriesUrls.VIDEO_COMMON, {
          params: {
            id: videoId,
          },
        })
        .then((res) => {
          setVideo(res.data);
        });
    },
    [setVideo]
  );

  // w2g connection
  useEffect(() => {
    if (connectionState !== HubConnectionState.Connected) return;

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

    w2gConnetion.on("onSync", (time) => {
      console.log(`remote: sync [time: ${time}]`);
      player.current?.seekNotNotify(time);
    });

    w2gConnetion.on("onRequestSync", () => {
      console.log("remote: sync request");
      w2gConnetion.invoke("Sync", player.current?.getTime());
    });

    w2gConnetion.on("onLobbyChanged", () => {
      getLobbyData();
    });

    return () => {
      w2gConnetion.invoke("LeaveTheLobby");

      w2gConnetion.off("onPlay");
      w2gConnetion.off("onPause");
      w2gConnetion.off("onSeek");
      w2gConnetion.off("onSync");
      w2gConnetion.off("onRequestSync");
    };
  }, [connectionState]);

  //#region use effects
  useEffect(() => {
    player.current?.setControls(isReady);
  }, [isReady]);

  useEffect(() => {
    if (user.status === AuthState.Authed && connectionState === HubConnectionState.Connected) {
      w2gConnetion.invoke("JoinToLobby", lobbyName);
    } else if (user.status === AuthState.NotAuthed) {
      navigator("/App/Main");
    }
  }, [user.status, connectionState]);
  //#endregion

  //#region Video Handels
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
      w2gConnetion.invoke("RequestSync");
      setReady(true);
    }
  };
  //#endregion

  const videoSelectedHandle = (video: VideoModel) => {
    getFullVideo(video.id);
    w2gConnetion.invoke("VideoChange", video.id);
  };

  const isMaster = user.value?.id === lobbyData?.master;

  return (
    <>
      <Stack className="w2g" spacing={2}>
        <Stack className="w2g-lobbyTitle">
          <Stack direction={"row"} spacing={2}>
            <h2>{lobbyData?.name}</h2>
            {isMaster && <h5>[Вы мастер]</h5>}
          </Stack>
        </Stack>
        <Stack direction={"row"} justifyContent={"center"}>
          {isMaster ? (
            <Stack className="w2g-selectButton" onClick={() => setSelectVideoOpened(true)}>
              <h4 className="w2g-selectButton__title">{video ? <>Видео: {video?.title}</> : <>Укажите видео</>}</h4>
            </Stack>
          ) : (
            <Stack className="w2g-selectButton">
              <h4 className="w2g-selectButton__title">
                {video ? <>Видео: {video?.title}</> : <>Мастер должен указать видео</>}
              </h4>
            </Stack>
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"center"}>
          {/*Видео*/}
          <Stack className="w2g-video">
            {video ? (
              <VideoPlayer
                url={video.videoUrl!}
                width={`auto`}
                ref={player}
                onPlay={onPlayHandle}
                onPause={onPauseHandle}
                onSeek={onSeekHandle}
                onReady={onReadyHandle}
              />
            ) : (
              <Alert severity="info">Видео не указано</Alert>
            )}
          </Stack>
        </Stack>
        {video && (
          <Stack style={{ marginLeft: "24px", marginRight: "24px" }} spacing={1}>
            {/*Теги*/}
            <Stack direction={"row"} spacing={1}>
              {video.tags?.map((tg, index) => {
                return (
                  <div style={{ backgroundColor: "#202020", padding: "4px", borderRadius: "6px" }} key={`v-t-${index}`}>
                    {tg}
                  </div>
                );
              })}
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Stack direction={"row"} spacing={3}>
                <h1>{video?.title}</h1>
                <Stack justifyContent={"center"}>
                  <div>Просмотров: {video.views}</div>
                </Stack>
              </Stack>
              <MarkVideo id={video.id} />
            </Stack>
            <p style={{ padding: "4px", backgroundColor: "#202020", borderRadius: "8px" }}>{video.description}</p>
          </Stack>
        )}
        <Stack direction={"row"} justifyContent={"space-between"} spacing={2}>
          {/*Список пользователей*/}
          <Stack></Stack>
          {/*Чат*/}
          <Stack></Stack>
        </Stack>
      </Stack>

      {/*Модальные окна*/}
      {isMaster && (
        <SelectVideoModal
          opened={selectVideoOpened}
          onClose={() => setSelectVideoOpened(false)}
          onVideoSelected={videoSelectedHandle}
        />
      )}
    </>
  );
});

export default W2GWatchPage;
