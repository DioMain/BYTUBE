import VideoModel from "@type/models/VideoModel";
import { Stack } from "@mui/material";
import "./style.scss";
import getCreatedTimeText from "@helpers/GetCreatedTimeText";

interface VIProps {
  video: VideoModel;
  onClick: () => void;
}

const VideoItem: React.FC<VIProps> = ({ video, onClick }) => {
  return (
    <Stack direction={"row"} className="vlist-vitem" spacing={1} onClick={onClick}>
      <Stack
        className="vlist-vitem__preview"
        justifyContent={"end"}
        style={{ backgroundImage: `url("${video.previewUrl}")` }}
      >
        <Stack direction={"row"} justifyContent={"end"}>
          <div className="vlist-vitem__preview-duration">{video.duration}</div>
        </Stack>
      </Stack>
      <Stack>
        <h2>{video.title}</h2>

        <Stack spacing={1}>
          <div>Создан: {getCreatedTimeText(video.created)}</div>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VideoItem;
