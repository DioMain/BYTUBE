import VideoModel from "@type/models/VideoModel";
import { Stack } from "@mui/material";
import getCreatedTimeText from "@helpers/GetCreatedTimeText";
import CircleIcon from "@mui/icons-material/Circle";
import styles from "./styled";

const VideoElement: React.FC<{ video: VideoModel }> = ({ video }) => {
  return (
    <styles.VideoElement
      onClick={() => window.location.assign(`/App/Video?id=${video.id}`)}
      direction={"row"}
      spacing={2}
    >
      <styles.VideoElementImage style={{ backgroundImage: `url("${video.previewUrl}")` }} justifyContent={"end"}>
        <Stack direction={"row"} justifyContent={"end"}>
          <styles.VideoElementImage_Duration>{video.duration}</styles.VideoElementImage_Duration>
        </Stack>
      </styles.VideoElementImage>
      <Stack justifyContent={"space-between"}>
        <h4>{video.title}</h4>
        <Stack>
          <styles.ChannelName
            onClick={(evt) => {
              if (!evt.isPropagationStopped()) evt.stopPropagation();

              window.location.assign(`/App/Channel?id=${video.channel?.id}`);
            }}
          >
            {video.channel?.name}
          </styles.ChannelName>
          <styles.VideoCreated>
            {video.views} просмотров <CircleIcon sx={{ fontSize: "8px" }} /> {getCreatedTimeText(video.created)}
          </styles.VideoCreated>
        </Stack>
      </Stack>
    </styles.VideoElement>
  );
};

export default VideoElement;
