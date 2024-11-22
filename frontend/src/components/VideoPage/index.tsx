import { LinearProgress, IconButton, Stack, Alert, Tooltip } from "@mui/material";
import useVideo from "@hooks/useVideo";
import VideoPlayer from "@components/VideoPlayer";
import StatusBase from "@type/StatusBase";
import FlagIcon from "@mui/icons-material/Flag";
import ChannelPanel from "./ChannePanel";
import GetUrlParams from "@helpers/GetUrlParams";
import MarkVideo from "./MarkVideo";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import OtherVideos from "./OtherVideos";

import "./style.scss";
import PlaylistViewer from "./PlaylistViewer";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import { useStores } from "appStoreContext";
import AuthState from "@type/AuthState";
import AddToPlaylistModal from "@components/AddToPlaylistModal";
import PlaylistModel from "@type/models/PlaylistModel";
import VideoModel from "@type/models/VideoModel";

const VideoPage: React.FC = () => {
  const id = GetUrlParams().get("id") as number;
  const playlistId = GetUrlParams().get("playlistId") as number | undefined;

  const video = useVideo(id);

  const [addToPlaylistOpened, setAddToPlaylistOpened] = useState(false);
  const [playlist, setPlaylist] = useState<PlaylistModel | null>(null);

  const { user } = useStores();

  useEffect(() => {
    if (video.status === StatusBase.Success) {
      axios.post(QueriesUrls.VIDEO_ADD_VIEW, null, {
        params: {
          id: video.data?.id,
        },
      });

      if (playlistId !== undefined) {
        axios
          .get(QueriesUrls.PLAYLIST_COMMON, {
            params: {
              id: playlistId,
            },
          })
          .then((res: AxiosResponse) => {
            setPlaylist(res.data);
          });
      }
    }
  }, [video.status]);

  const reportHandle = () => {};

  const addToPlaylistHandle = () => {
    setAddToPlaylistOpened(true);
  };

  switch (video.status) {
    case StatusBase.Loading:
      return <LinearProgress />;
    case StatusBase.Failed:
      return <Alert severity="error">{video.fail}</Alert>;
    default:
      return (
        <>
          <div className="videopage">
            <Stack className="videopage-main">
              <VideoPlayer url={video.data?.videoUrl!} className="videopage__player" width={`auto`} />
              <h1 className="videopage-vtitle">{video.data?.title}</h1>
              <Stack spacing={3} direction={"row"}>
                <div className="videopage-views">{video.data?.views} просмотров</div>
                <Stack direction={"row"} spacing={1}>
                  {video.data?.tags?.map((item, index) => {
                    return (
                      <div key={`vp-tag-${index}`} className="videopage-tag">
                        #{item}
                      </div>
                    );
                  })}
                </Stack>
              </Stack>
              <Stack className="videopage-control" direction={"row"} spacing={2} justifyContent={"space-between"}>
                <ChannelPanel channel={video.data?.channel!} />
                <Stack direction={"row"} spacing={2}>
                  <Stack justifyContent={"center"}>
                    <Tooltip title="Добавить в плейлист">
                      <IconButton onClick={addToPlaylistHandle} disabled={user.status !== AuthState.Authed}>
                        <PlaylistAddIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Stack justifyContent={"center"}>
                    <Tooltip title="Пожаловатся">
                      <IconButton onClick={reportHandle} disabled={user.status !== AuthState.Authed}>
                        <FlagIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <MarkVideo id={video.data?.id!} />
                </Stack>
              </Stack>
              <Stack className="videopage-description">{video.data?.description}</Stack>
              <Stack className="videopage-comments"></Stack>
            </Stack>
            <Stack className="videopage-othervideos" spacing={2}>
              {playlistId === undefined ? (
                <OtherVideos videoId={video.data?.id!} />
              ) : (
                <>
                  {playlist !== null && (
                    <>
                      <PlaylistViewer playlist={playlist} />
                      <OtherVideos videoId={video.data?.id!} />
                    </>
                  )}
                </>
              )}
            </Stack>
          </div>

          <AddToPlaylistModal
            video={video.data!}
            opened={addToPlaylistOpened}
            onClose={() => setAddToPlaylistOpened(false)}
          />
        </>
      );
  }
};

export default VideoPage;
