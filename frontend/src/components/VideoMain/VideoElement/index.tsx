import VideoModel from "@type/models/VideoModel";
import getCreatedTimeText from "@helpers/GetCreatedTimeText";
import "./styles.scss";
import { url } from "inspector";

const VideoElement: React.FC<{ video: VideoModel }> = ({ video }) => {
  const createdTime = getCreatedTimeText(video.created);

  return (
    <div className="videoelement">
      <div
        className="videoelement-image"
        style={{ backgroundImage: `url("/videos/${video.id}/preview.png")` }}
        onClick={() => window.location.assign(`/App/Video?vid=${video.id}`)}
      >
        <div className="videoelement-image-row">
          <div className="videoelement-image-duration">{video.duration}</div>
        </div>
      </div>
      <div className="videoelement-info">
        <div className="videoelement-info-col0">
          <div
            className="videoelement-info-col0__chicon"
            style={{ backgroundImage: `url("/channels/${video.channel?.id}/icon.png")` }}
          ></div>
        </div>
        <div className="videoelement-info-col1">
          <div className="videoelement-info-col1-title">{video.title}</div>
          <div className="videoelement-info-col1__channelname">{video.channel?.name}</div>
          <div className="videoelement-info-col1-viewsandcreated">{`${video.views} просмотров - ${createdTime}`}</div>
        </div>
      </div>
    </div>
  );
};

export default VideoElement;