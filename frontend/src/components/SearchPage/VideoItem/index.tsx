import VideoModel from "@type/models/VideoModel";
import "./style.scss";
import { Stack } from "@mui/material";
import QueriesUrls from "@helpers/QeuriesUrls";
import getCreatedTimeText from "@helpers/GetCreatedTimeText";

const VideoItem: React.FC<{ video: VideoModel }> = ({ video }) => {
  return (
    <Stack
      className="searchpage-videoitem"
      direction={"row"}
      spacing={2}
      onClick={() => window.location.assign(`${QueriesUrls.VIDEO_PAGE}?id=${video.id}`)}
    >
      <Stack
        justifyContent={"end"}
        style={{ backgroundImage: `url("${video.previewUrl}")` }}
        className="searchpage-videoitem__img"
      >
        <Stack direction={"row"} justifyContent={"end"}>
          <div className="searchpage-videoitem__img-duration">{video.duration}</div>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <h2>{video.title}</h2>
          <div style={{ fontSize: "14px" }}>
            {getCreatedTimeText(video.created)} - {video.views} просмотров
          </div>
        </Stack>
        <Stack direction={"row"} className="searchpage-videoitem-channel" spacing={1}>
          <div
            className="searchpage-videoitem-channel__icon"
            style={{ backgroundImage: `url("${video.channel?.iconUrl}")` }}
          ></div>
          <Stack>
            <a
              className="searchpage-videoitem-channel__link"
              href={`${QueriesUrls.CHANNEL_PAGE}?id=${video.channel?.id}`}
            >
              {video.channel?.name}
            </a>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VideoItem;
