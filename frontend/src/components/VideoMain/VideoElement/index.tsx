import VideoModel from "@type/models/VideoModel";
import getCreatedTimeText from "@helpers/GetCreatedTimeText";
import "./styles.scss";
import QueriesUrls from "@helpers/QeuriesUrls";
import ImageWithDuration from "@components/ImageWithDuration";
import { useNavigate } from "react-router-dom";

const VideoElement: React.FC<{ video: VideoModel }> = ({ video }) => {
  const createdTime = getCreatedTimeText(video.created);

  const navigator = useNavigate();

  return (
    <div className="videoelement">
      <ImageWithDuration
        duration={video.duration}
        previewUrl={video.previewUrl}
        className="videoelement-image"
        aspect={1.28}
        onClick={() => navigator(`/App/Video?id=${video.id}`)}
      />
      <div className="videoelement-info">
        <div className="videoelement-info-col0">
          <div
            className="videoelement-info-col0__chicon"
            style={{ backgroundImage: `url("${video.channel?.iconUrl}")` }}
          ></div>
        </div>
        <div className="videoelement-info-col1">
          <div className="videoelement-info-col1-title">{video.title}</div>
          <div
            className="videoelement-info-col1__channelname"
            onClick={() => navigator(`${QueriesUrls.CHANNEL_PAGE}?id=${video.channel?.id}`)}
          >
            {video.channel?.name}
          </div>
          <div className="videoelement-info-col1-viewsandcreated">{`${video.views} просмотров - ${createdTime}`}</div>
        </div>
      </div>
    </div>
  );
};

export default VideoElement;
