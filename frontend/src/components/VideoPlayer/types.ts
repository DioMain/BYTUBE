import PropsBase from "@type/PropsBase";

interface VideoPlayerProps extends PropsBase {
  url: string;
  width: string;
  onVideoEnded?: () => void;
  autoplay?: boolean;
}

export { VideoPlayerProps };
