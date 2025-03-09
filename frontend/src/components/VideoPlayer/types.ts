import PropsBase from "@type/PropsBase";

interface VideoPlayerProps extends PropsBase {
  url: string;
  width: string;
  onVideoEnded?: () => void;
  onSeek?: (sec: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onReady?: () => void;
  autoplay?: boolean;
}

interface VideoPlayerRef {
  getPlayer: () => HTMLVideoElement;
  getTime: () => number;
  getIsPlay: () => boolean;

  setControls: (isActive: boolean) => void;

  play: () => void;
  pause: () => void;
  seek: (time: number) => void;

  playNotNotify: () => void;
  pauseNotNotify: () => void;
  seekNotNotify: (time: number) => void;
}

export { VideoPlayerProps, VideoPlayerRef };
