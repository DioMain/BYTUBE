import VideoModel from "@type/models/VideoModel";
import { Divider, Stack } from "@mui/material";
import getCreatedTimeText from "@helpers/GetCreatedTimeText";
import ImageWithDuration from "@components/ImageWithDuration";
import styles from "./styled";

interface VIProps {
  video: VideoModel;
  onClick: () => void;
}

const VideoItem: React.FC<VIProps> = ({ video, onClick }) => {
  return (
    <styles.VideoListItem direction={"row"} className="vlist-vitem" spacing={1} onClick={onClick}>
      <ImageWithDuration previewUrl={video.previewUrl} duration={video.duration} aspect={1.1} />
      <Stack justifyContent={"space-between"}>
        <Stack>
          <styles.ItemTitle>{video.title}</styles.ItemTitle>
          <Divider />
          <styles.ItemDescription>{video.description}</styles.ItemDescription>
          <Divider />
          <div>Просмотров: {video.views}</div>
        </Stack>

        <Stack spacing={1}>
          <div>Создан: {getCreatedTimeText(video.created)}</div>
        </Stack>
      </Stack>
    </styles.VideoListItem>
  );
};

export default VideoItem;
