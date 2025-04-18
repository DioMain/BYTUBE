import { Stack } from "@mui/material";
import ImageWithDuration from "@components/ImageWithDuration";
import VideoModel from "@type/models/VideoModel";
import styles from "./styled";
import { useNavigate } from "react-router-dom";

interface ChannelVideoItemProps {
  video: VideoModel;
}

const ChannelVideoItem: React.FC<ChannelVideoItemProps> = ({ video }) => {
  const navigator = useNavigate();

  const created = new Date(video.created);

  const clickVideoHandle = () => {
    navigator(`/App/Video?id=${video.id}`);
  };

  return (
    <styles.ChannelViewItem direction="row" spacing={1} onClick={clickVideoHandle}>
      <ImageWithDuration duration={video.duration} aspect={0.7} previewUrl={video.previewUrl} />
      <Stack style={{ width: "100%" }}>
        <Stack justifyContent={"space-between"} direction={"row"}>
          <h3>{video.title}</h3>
          <div>
            {created.getDate()}.{created.getMonth() + 1}.{created.getFullYear()}
          </div>
        </Stack>
        <p>{video.description}</p>
      </Stack>
    </styles.ChannelViewItem>
  );
};

export default ChannelVideoItem;
