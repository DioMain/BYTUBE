import { Divider, Stack } from "@mui/material";
import VideoModel from "@type/models/VideoModel";
import QueriesUrls from "@helpers/QeuriesUrls";
import getCreatedTimeText from "@helpers/GetCreatedTimeText";
import ImageWithDuration from "@components/ImageWithDuration";
import styles from "./styled";

const VideoItem: React.FC<{ video: VideoModel }> = ({ video }) => {
  return (
    <styles.SearchPageVideoItem
      direction={"row"}
      spacing={2}
      onClick={() => window.location.assign(`${QueriesUrls.VIDEO_PAGE}?id=${video.id}`)}
    >
      <ImageWithDuration previewUrl={video.previewUrl} duration={video.duration} />
      <Stack spacing={2}>
        <Stack>
          <styles.ItemTitle>{video.title}</styles.ItemTitle>
          <Divider />
          <styles.ItemDescription>{video.description}</styles.ItemDescription>
          <div style={{ fontSize: "14px" }}>
            {getCreatedTimeText(video.created)} - {video.views} просмотров
          </div>
        </Stack>
        <styles.ItemChannel direction={"row"} spacing={1}>
          <styles.ItemChannelIcon
            style={{ backgroundImage: `url("${video.channel?.iconUrl}")` }}
          ></styles.ItemChannelIcon>
          <Stack>
            <styles.ItemChannelLink href={`${QueriesUrls.CHANNEL_PAGE}?id=${video.channel?.id}`}>
              {video.channel?.name}
            </styles.ItemChannelLink>
          </Stack>
        </styles.ItemChannel>
      </Stack>
    </styles.SearchPageVideoItem>
  );
};

export default VideoItem;
