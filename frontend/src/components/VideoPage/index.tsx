import { LinearProgress, IconButton } from "@mui/material";
import useVideo from "@hooks/useVideo";
import VideoPlayer from "@components/VideoPlayer";
import StatusBase from "@type/StatusBase";
import VideoElement from "./VideoElement";
import useVideos from "@hooks/useVideos";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import ChannelView from "./ChannelView";
import "./style.scss";
import GetUrlParams from "@helpers/GetUrlParams";

const VideoPage: React.FC = () => {
  const vid = GetUrlParams().get("vid") as number;

  const video = useVideo(vid);
  const otherVideos = useVideos(0, 10);

  switch (video.status) {
    case StatusBase.Loading:
      return <LinearProgress />;
    case StatusBase.Failed:
      return <div>{video.fail}</div>;
    default:
      return (
        <div className="videopage">
          <div className="videopage-main">
            <VideoPlayer url={video.data?.videoUrl!} className="videopage__player" width={`auto`} />

            <h1 className="videopage-vtitle">{video.data?.title}</h1>
            <div className="videopage-control">
              <ChannelView channel={video.data?.channel!} imgSize="48px" />
              <IconButton>
                <MoreIcon />
              </IconButton>
            </div>
            <div className="videopage-description">{video.data?.description}</div>
            <div className="videopage-comments"></div>
          </div>
          <div className="videopage-othervideos">
            {otherVideos.status === StatusBase.Success &&
              otherVideos.data.map((item, index) => {
                if (item.id === vid) return null;

                return <VideoElement video={item} key={`othervideo${index}`} />;
              })}
          </div>
        </div>
      );
  }
};

export default VideoPage;
