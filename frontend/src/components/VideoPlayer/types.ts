import PropsBase from "@type/PropsBase";
import ReactPlayer from "react-player";

interface VideoPlayerProps extends PropsBase {
  url: string;
  width: string;
  onVideoEnded?: () => void;
  autoplay?: boolean;
  ref?: React.RefObject<ReactPlayer>;
}

export { VideoPlayerProps };
