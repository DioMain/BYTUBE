import VideoModel from "@type/models/VideoModel";
import "./style.scss";
import { Stack } from "@mui/material";
import getCreatedTimeText from "@helpers/GetCreatedTimeText";
import CircleIcon from "@mui/icons-material/Circle";

const VideoElement: React.FC<{ video: VideoModel }> = ({ video }) => {
  return (
    <Stack
      className="vpvideoelement"
      onClick={() => window.location.assign(`/App/Video?id=${video.id}`)}
      direction={"row"}
      spacing={2}
    >
      <Stack
        className="vpvideoelement-image"
        style={{ backgroundImage: `url("${video.previewUrl}")` }}
        justifyContent={"end"}
      >
        <Stack direction={"row"} justifyContent={"end"}>
          <Stack className="vpvideoelement-image-duration">{video.duration}</Stack>
        </Stack>
      </Stack>
      <Stack justifyContent={"space-between"}>
        <h4>{video.title}</h4>
        <Stack>
          <div
            className="vpvideoelement-chname"
            onClick={(evt) => {
              if (!evt.isPropagationStopped()) evt.stopPropagation();

              window.location.assign(`/App/Channel?id=${video.channel?.id}`);
            }}
          >
            {video.channel?.name}
          </div>
          <div className="vpvideoelement-viewscreated">
            {video.views} просмотров <CircleIcon sx={{ fontSize: "8px" }} /> {getCreatedTimeText(video.created)}
          </div>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VideoElement;
