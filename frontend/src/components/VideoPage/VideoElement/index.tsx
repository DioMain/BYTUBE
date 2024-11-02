import VideoModel from "@type/models/VideoModel";
import "./style.scss";

const VideoElement: React.FC<{ video: VideoModel }> = ({ video }) => {
  return (
    <div className="vpvideoelement" onClick={() => window.location.assign(`/App/Video?vid=${video.id}`)}>
      <div className="vpvideoelement-image" style={{ backgroundImage: `url("${video.previewUrl}")` }}>
        <div className="vpvideoelement-image-row">
          <div className="vpvideoelement-image-duration">{video.duration}</div>
        </div>
      </div>
      <div>{video.title}</div>
    </div>
  );
};

export default VideoElement;
