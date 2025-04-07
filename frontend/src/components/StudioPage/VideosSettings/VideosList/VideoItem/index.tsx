import VideoModel, { Status } from "@type/models/VideoModel";
import { Divider, Stack } from "@mui/material";
import getCreatedTimeText from "@helpers/GetCreatedTimeText";
import ImageWithDuration from "@components/ImageWithDuration";
import styles from "./styled";
import NormalIcon from "@mui/icons-material/InsertEmoticon";
import LimitedIcon from "@mui/icons-material/SentimentDissatisfied";
import BlockedIcon from "@mui/icons-material/Close";

interface VIProps {
  video: VideoModel;
  onClick: () => void;
}

const VideoItem: React.FC<VIProps> = ({ video, onClick }) => {
  const getAccessIcon = () => {
    switch (video.videoStatus) {
      case Status.NoLimit:
        return <NormalIcon color="success" />;
      case Status.Limited:
        return <LimitedIcon color="warning" />;
      case Status.Blocked:
        return <BlockedIcon color="error" />;
    }
  };

  return (
    <styles.VideoListItem direction={"row"} className="vlist-vitem" spacing={1} onClick={onClick}>
      <ImageWithDuration previewUrl={video.previewUrl} duration={video.duration} aspect={1.1} />
      <Stack justifyContent={"space-between"} style={{ width: "100%" }}>
        <Stack>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <styles.ItemTitle>{video.title}</styles.ItemTitle>
            <div>{getAccessIcon()}</div>
          </Stack>
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
