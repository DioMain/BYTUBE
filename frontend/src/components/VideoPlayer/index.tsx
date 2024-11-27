import { VideoPlayerProps } from "./types";
import PlayerIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { IconButton, LinearProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./style.scss";

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  className = "",
  style,
  url,
  width,
  onVideoEnded,
  autoplay = false,
}) => {
  const videoElement = useRef<ReactPlayer>(null);
  const playerContainer = useRef<HTMLDivElement>(null);

  const [isPlay, setPlay] = useState<boolean>(autoplay ?? false);
  const [autoWidth, setAutoWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerContainer.current?.clientWidth !== autoWidth) setAutoWidth(playerContainer.current?.clientWidth);
    }, 60);

    return () => clearInterval(interval);
  }, [autoWidth, setAutoWidth]);

  return (
    <div ref={playerContainer} className={`player ${className}`} style={style}>
      <div className="player__main">
        <ReactPlayer
          ref={videoElement}
          playing={isPlay}
          url={url}
          width={width === "auto" ? `${autoWidth}px` : width}
          height={"auto"}
          onProgress={undefined}
          controls
          onEnded={onVideoEnded}
        />
      </div>
      <div className="player-controls">
        <div className="player-controls-row">
          <IconButton onClick={undefined}>{isPlay ? <PauseIcon /> : <PlayerIcon />}</IconButton>

          <LinearProgress variant="determinate" value={100} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
