import { VideoPlayerProps } from "./types";
import PlayerIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { IconButton, LinearProgress } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import "./style.scss";
import ReactPlayer from "react-player";

const VideoPlayer: React.FC<VideoPlayerProps> = ({ className = "", style, url, width }) => {
  const videoElement = useRef<ReactPlayer>(null);

  const [isPlay, setPlay] = useState(false);

  const clickHandle = useCallback(() => {
    setPlay(!isPlay);
  }, [isPlay, setPlay]);

  return (
    <div className={`player ${className}`} style={style}>
      <div className="player__main">
        <ReactPlayer ref={videoElement} playing={isPlay} url={url} width={width} onProgress={undefined} controls />
      </div>
      <div className="player-controls">
        <div className="player-controls-row">
          <IconButton onClick={clickHandle}>{isPlay ? <PauseIcon /> : <PlayerIcon />}</IconButton>

          <LinearProgress variant="determinate" value={100} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
