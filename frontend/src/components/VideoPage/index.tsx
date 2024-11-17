import { LinearProgress, IconButton, Stack, Alert, Tooltip } from "@mui/material";
import useVideo from "@hooks/useVideo";
import VideoPlayer from "@components/VideoPlayer";
import StatusBase from "@type/StatusBase";
import VideoElement from "./VideoElement";
import useVideos from "@hooks/useVideos";
import FlagIcon from "@mui/icons-material/Flag";
import ChannelPanel from "./ChannePanel";
import GetUrlParams from "@helpers/GetUrlParams";
import MarkVideo from "./MarkVideo";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import "./style.scss";

const VideoPage: React.FC = () => {
  const vid = GetUrlParams().get("vid") as number;

  const video = useVideo(vid);
  const otherVideos = useVideos(0, 10);

  const reportHandle = () => {};

  const addToPlaylistHandle = () => {};

  switch (video.status) {
    case StatusBase.Loading:
      return <LinearProgress />;
    case StatusBase.Failed:
      return <Alert severity="error">{video.fail}</Alert>;
    default:
      return (
        <div className="videopage">
          <Stack className="videopage-main">
            <VideoPlayer url={video.data?.videoUrl!} className="videopage__player" width={`auto`} />

            <h1 className="videopage-vtitle">{video.data?.title}</h1>
            <Stack className="videopage-control" direction={"row"} spacing={2} justifyContent={"space-between"}>
              <ChannelPanel channel={video.data?.channel!} />
              <Stack direction={"row"} spacing={2}>
                <Stack justifyContent={"center"}>
                  <Tooltip title="Добавить в плейлист">
                    <IconButton onClick={addToPlaylistHandle}>
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
                <MarkVideo id={video.data?.id!} />
              </Stack>
            </Stack>
            <Stack className="videopage-description">{video.data?.description}</Stack>
            <Stack className="videopage-comments"></Stack>
          </Stack>
          <Stack className="videopage-othervideos" spacing={1}>
            {otherVideos.status === StatusBase.Success &&
              otherVideos.data.map((item, index) => {
                if (item.id === vid) return null;

                return <VideoElement video={item} key={`othervideo${index}`} />;
              })}
          </Stack>
        </div>
      );
  }
};

export default VideoPage;
