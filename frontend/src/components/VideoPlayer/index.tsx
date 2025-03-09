import { VideoPlayerRef, VideoPlayerProps } from "./types";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./style.scss";

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>((props, ref) => {
  const videoElement = useRef<ReactPlayer>(null);
  const playerContainer = useRef<HTMLDivElement>(null);

  const [isPlay, setPlay] = useState<boolean>(props.autoplay ?? false);
  const [autoWidth, setAutoWidth] = useState<number | undefined>(undefined);
  const [controls, setControls] = useState(true);

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

  useImperativeHandle(ref, () => ({
    getPlayer: () => videoElement.current?.getInternalPlayer() as HTMLVideoElement,
    getTime: () => videoElement.current?.getCurrentTime()!,
    getIsPlay: () => true,

    setControls: (controls) => setControls(controls),

    play: () => setPlay(true),
    pause: () => setPlay(false),
    seek: (time) => videoElement.current?.seekTo(time, "seconds"),

    playNotNotify: () => {
      if (!isPlay) {
        notifys.current.playNotify = false;
        setPlay(true);
      }
    },
    pauseNotNotify: () => {
      if (isPlay) {
        notifys.current.pauseNotify = false;
        setPlay(false);
      }
    },
    seekNotNotify: (time) => {
      notifys.current.seekNotify = false;
      videoElement.current?.seekTo(time, "seconds");
    },
  }));

  return (
    <div ref={playerContainer} className={`player ${props.className}`} style={props.style}>
      <div className="player__main">
        <ReactPlayer
          ref={videoElement}
          playing={isPlay}
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
