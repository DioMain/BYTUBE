import { VideoPlayerRef, VideoPlayerProps } from "./types";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./style.scss";

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>((props, ref) => {
  const videoElement = useRef<ReactPlayer>(null);
  const playerContainer = useRef<HTMLDivElement>(null);

  const [autoWidth, setAutoWidth] = useState<number | undefined>(undefined);
  const [controls, setControls] = useState(true);
  const [innerPlayer, setInnerPlayer] = useState<HTMLVideoElement | null>(null);

  const notifys = useRef({
    playNotify: true,
    pauseNotify: true,
    seekNotify: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerContainer.current?.clientWidth !== autoWidth) setAutoWidth(playerContainer.current?.clientWidth);
    }, 60);
    return () => clearInterval(interval);
  }, [autoWidth]);

  useEffect(() => {
    setInnerPlayer(videoElement.current?.getInternalPlayer() as HTMLVideoElement);
    videoElement.current?.seekTo(0, "seconds");
  }, [videoElement.current]);

  const IsPlaying = () => !innerPlayer?.paused && !innerPlayer?.ended;

  useImperativeHandle(ref, () => ({
    getPlayer: () => innerPlayer!,
    getTime: () => videoElement.current?.getCurrentTime()!,
    getIsPlay: IsPlaying,

    setControls: (controls) => setControls(controls),

    play: () => innerPlayer?.play(),
    pause: () => innerPlayer?.pause(),
    seek: (time) => videoElement.current?.seekTo(time, "seconds"),

    playNotNotify: () => {
      if (!IsPlaying()) {
        notifys.current.playNotify = false;
        innerPlayer?.play();
      }
    },
    pauseNotNotify: () => {
      if (IsPlaying()) {
        notifys.current.pauseNotify = false;
        innerPlayer?.pause();
      }
    },
    seekNotNotify: (time) => {
      notifys.current.seekNotify = false;
      videoElement.current?.seekTo(time, "seconds");
    },
  }));

  if (innerPlayer === null) return;

  return (
    <div ref={playerContainer} className={`player ${props.className}`} style={props.style}>
      <div className="player__main">
        <ReactPlayer
          ref={videoElement}
          url={props.url}
          width={props.width === "auto" ? `${autoWidth}px` : props.width}
          height={"auto"}
          controls={controls}
          onEnded={props.onVideoEnded}
          onReady={props.onReady}
          onPlay={() => {
            if (notifys.current.playNotify && props.onPlay) props.onPlay();

            notifys.current.playNotify = true;
          }}
          onPause={() => {
            if (notifys.current.pauseNotify && props.onPause) props.onPause();

            notifys.current.pauseNotify = true;
          }}
          onSeek={(evt) => {
            if (notifys.current.seekNotify && props.onSeek) props.onSeek(evt);

            notifys.current.seekNotify = true;
          }}
        />
      </div>
    </div>
  );
});

export default VideoPlayer;
