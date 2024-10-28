import VideoElement from "@components/VideoElement";
import useVideos from "@hooks/useVideos";
import ReactPlayer from "react-player";

const VideoMain: React.FC = () => {
  const { data, status, fail } = useVideos(0, 5);
  return (
    <div style={{ display: "flex", gap: "16px", padding: "16px", flexWrap: "wrap" }}>
      {data.map((val, index) => {
        return <VideoElement key={`VE${index}`} video={val} />;
      })}
    </div>
  );
};

export default VideoMain;
