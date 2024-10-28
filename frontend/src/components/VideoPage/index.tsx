import ReactPlayer from "react-player";
import "./style.scss";
import useVideo from "@hooks/useVideo";

const VideoPage: React.FC = () => {
  const vid = parseInt(URL.parse(window.location.href)?.searchParams.get("vid")!);

  const { data, status, fail } = useVideo(vid);

  return (
    <div>
      <ReactPlayer url={`/videos/${vid}/video.mp4`} controls />
    </div>
  );
};

export default VideoPage;
