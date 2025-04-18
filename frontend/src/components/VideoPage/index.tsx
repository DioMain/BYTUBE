import {
  LinearProgress,
  IconButton,
  Stack,
  Alert,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import VideoPlayer from "@components/VideoPlayer";
import StatusBase from "@type/StatusBase";
import FlagIcon from "@mui/icons-material/Flag";
import ChannelButton from "./ChannelButton";
import GetUrlParams from "@helpers/GetUrlParams";
import MarkVideo from "./MarkVideo";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import OtherVideos from "./OtherVideos";
import PlaylistViewer from "./PlaylistViewer";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import { useStores } from "appStoreContext";
import AuthState from "@type/AuthState";
import AddToPlaylistModal from "@components/AddToPlaylistModal";
import PlaylistModel from "@type/models/PlaylistModel";
import useVideoGlobal from "@hooks/useVideoGlobal";
import { observer } from "mobx-react-lite";
import CommentsViewer from "@components/CommentsViewer";
import WatchTogeather from "@mui/icons-material/AddToQueue";
import { ExpandMore } from "@mui/icons-material";
import ReportModal from "./ReportModal";
import { useNavigate } from "react-router-dom";
import ServerError from "@type/ServerError";
import styles from "./styled";
import AgeBlockerModal from "../AgeBlockerModal";
import { Status } from "@type/models/VideoModel";
import { ChannelStatus } from "@type/models/ChannelModel";

const VideoPage: React.FC = observer(() => {
  const id = GetUrlParams().get("id") as number;
  const playlistId = GetUrlParams().get("playlistId") as number | undefined;

  const videoResponce = useVideoGlobal(id);

  const navigator = useNavigate();

  const [addToPlaylistOpened, setAddToPlaylistOpened] = useState(false);
  const [reportModalOpened, setReportModalOpened] = useState(false);
  const [ageBlockerModalOpened, setAgeBlockerModalOpened] = useState(false);
  const [playlist, setPlaylist] = useState<PlaylistModel | null>(null);

  const { user, video } = useStores();

  useEffect(() => {
    if (videoResponce.status === StatusBase.Success) {
      axios.post(QueriesUrls.VIDEO_ADD_VIEW, null, {
        params: {
          id: video.value?.id,
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
          })
          .catch((err: AxiosError) => {
            window.location.assign(QueriesUrls.MAIN_PAGE);
          });
      }

      const userBirthDay = new Date(user.value?.birthDay!);
      const nowDate = new Date();
      const userAge = nowDate.getFullYear() - userBirthDay.getFullYear();

      console.log(video.value?.channel);
      if (
        userAge < 18 &&
        (video.value?.forAdults ||
          video.value?.videoStatus === Status.Limited ||
          video.value?.channel?.status === ChannelStatus.Limited)
      ) {
        setAgeBlockerModalOpened(true);
      }
    }
  }, [videoResponce.status]);

  const reportHandle = () => {
    setReportModalOpened(true);
  };

  const addToPlaylistHandle = () => {
    setAddToPlaylistOpened(true);
  };

  const onEndVideoHandler = () => {
    if (playlist !== null) {
      const curIndex = playlist.playlistItems.findIndex((item) => item.videoId === video.value!.id);
      console.log(curIndex);
      if (curIndex < playlist.playlistItems.length - 1)
        window.location.assign(
          `${QueriesUrls.VIDEO_PAGE}?id=${playlist.playlistItems[curIndex + 1].videoId}&playlistId=${playlist.id}`
        );
    }
  };

  const handleTagClick = (tag: string) => {
    let url = new URL(QueriesUrls.SEARCH_PAGE, window.location.origin);
    url.searchParams.set("search", tag);

    window.location.assign(url.toString());
  };

  const handleToW2G = () => {
    const name = `${user.value?.name}\`s lobby ${video.value?.title}`;

    axios
      .post(QueriesUrls.W2G_LOBBYS_COMMON, {
        Name: name,
        Password: null,
        Video: video.value?.id,
      })
      .then(() => {
        navigator(`/App/WatchTogether/Lobby?lobby=${name}`);
      })
      .catch((err: AxiosError) => {
        let srvErr = new ServerError(err.response?.data);

        console.error(srvErr.getFirstError());
      });
  };

  switch (videoResponce.status) {
    case StatusBase.Loading:
      return <LinearProgress />;
    case StatusBase.Failed:
      return <Alert severity="error">{videoResponce.fail}</Alert>;
    default:
      return (
        <>
          <styles.VideoPage>
            <styles.VideoPageMain>
              <VideoPlayer
                url={video.value?.videoUrl!}
                width={`auto`}
                onVideoEnded={onEndVideoHandler}
                autoplay={false}
              />
              <styles.VideoTitle>{video.value?.title}</styles.VideoTitle>
              <Stack spacing={3} direction={"row"}>
                <div>{video.value?.views} просмотров</div>
                <Stack direction={"row"} spacing={1}>
                  {video.value?.tags?.map((item, index) => {
                    return (
                      <styles.VideoTag key={`vp-tag-${index}`} onClick={() => handleTagClick(`#${item}`)}>
                        #{item}
                      </styles.VideoTag>
                    );
                  })}
                </Stack>
              </Stack>
              <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
                <ChannelButton channel={video.value?.channel!} />
                <Stack direction={"row"} spacing={2}>
                  <Stack justifyContent={"center"}>
                    <Tooltip title="Совместный просмотр">
                      <IconButton onClick={handleToW2G} disabled={user.status !== AuthState.Authed}>
                        <WatchTogeather />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Stack justifyContent={"center"}>
                    <Tooltip title="Добавить в плейлист">
                      <IconButton onClick={addToPlaylistHandle} disabled={user.status !== AuthState.Authed}>
                        <PlaylistAddIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Stack justifyContent={"center"}>
                    <Tooltip title="Пожаловатся">
                      <IconButton onClick={reportHandle}>
                        <FlagIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <MarkVideo id={video.value?.id!} />
                </Stack>
              </Stack>
              <styles.VideoDescription>{video.value?.description}</styles.VideoDescription>
              <Stack>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>Комментарии</AccordionSummary>
                  <AccordionDetails>
                    <CommentsViewer video={video.value!} />
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </styles.VideoPageMain>
            <styles.OtherVideos spacing={2}>
              {playlistId === undefined ? (
                <OtherVideos videoId={video.value?.id!} />
              ) : (
                <>
                  {playlist !== null && (
                    <>
                      <PlaylistViewer playlist={playlist} />
                      <OtherVideos videoId={video.value?.id!} />
                    </>
                  )}
                </>
              )}
            </styles.OtherVideos>
          </styles.VideoPage>

          <AddToPlaylistModal
            video={video.value!}
            opened={addToPlaylistOpened}
            onClose={() => setAddToPlaylistOpened(false)}
          />

          <AgeBlockerModal isOpen={ageBlockerModalOpened} onClose={() => setAgeBlockerModalOpened(false)} />

          <ReportModal opened={reportModalOpened} onClose={() => setReportModalOpened(false)} />
        </>
      );
  }
});

export default VideoPage;
