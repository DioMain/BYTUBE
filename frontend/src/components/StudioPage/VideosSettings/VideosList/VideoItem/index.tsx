import VideoModel from "@type/models/VideoModel";
import { Stack } from "@mui/material";
import "./style.scss";

interface VIProps {
  video: VideoModel;
}

const VideoItem: React.FC<VIProps> = ({ video }) => {
  return (
    <Stack direction={"row"}>
      <Stack style={{ backgroundColor: `url("${video.previewUrl}")` }}></Stack>
    </Stack>
  );
};

export default VideoItem;
