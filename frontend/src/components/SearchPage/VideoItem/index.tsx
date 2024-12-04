import VideoModel from "@type/models/VideoModel";
import "./style.scss";
import { Stack } from "@mui/material";
import QueriesUrls from "@helpers/QeuriesUrls";
import getCreatedTimeText from "@helpers/GetCreatedTimeText";

const VideoItem: React.FC<{ video: VideoModel }> = ({ video }) => {
  return (
    <Stack className="searchpage-videoitem" direction={"row"} spacing={2}>
      <Stack
        justifyContent={"end"}
        style={{ backgroundImage: `url("${video.previewUrl}")` }}
        className="searchpage-videoitem__img"
      >
        <Stack direction={"row"} justifyContent={"end"}>
          <div className="searchpage-videoitem__img-duration">{video.duration}</div>
        </Stack>
      </Stack>
      <Stack justifyContent={"space-between"}>
        <Stack>
          <h3>{video.title}</h3>
          <a className="searchpage-videoitem-channel" href={`${QueriesUrls.CHANNEL_PAGE}?id=${video.channel?.id}`}>
            {video.channel?.name}
          </a>
        </Stack>
        <Stack>
          <h5>
            {getCreatedTimeText(video.created)} - {video.views} просмотров
          </h5>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VideoItem;
