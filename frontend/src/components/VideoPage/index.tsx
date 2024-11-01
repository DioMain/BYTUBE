import useVideo from "@hooks/useVideo";
import VideoPlayer from "@components/VideoPlayer";
import "./style.scss";
import StatusBase from "@type/StatusBase";
import { LinearProgress } from "@mui/material";

const VideoPage: React.FC = () => {
  const vid = parseInt(URL.parse(window.location.href)?.searchParams.get("vid")!);

  const { data, status, fail } = useVideo(vid);

  switch (status) {
    case StatusBase.Loading:
      return <LinearProgress />;
    case StatusBase.Failed:
      return <div>{fail}</div>;
    default:
      return (
        <div className="videopage">
          <div className="videopage-col0">
            <div className="videopage__player">
              <VideoPlayer url={`/videos/${vid}/video.mp4`} width="640px" />
            </div>
            <div></div>
          </div>
          <div className="videopaeg-col0"></div>
        </div>
      );
  }
};

export default VideoPage;
