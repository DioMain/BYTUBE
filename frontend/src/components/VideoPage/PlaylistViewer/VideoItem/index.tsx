import React from "react";
import "./style.scss";
import VideoModel from "@type/models/VideoModel";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { Delete, PlayArrow } from "@mui/icons-material";

interface PMVI_Props {
  video: VideoModel;
  onClick: () => void;
  isCurrent: boolean;
}

const VideoItem: React.FC<PMVI_Props> = ({ video, onClick, isCurrent }) => {
  return (
    <Stack direction={"row"} justifyContent={"space-between"} className="plv-videoitem" onClick={onClick}>
      <Stack direction={"row"} spacing={2}>
        <Stack
          style={{ backgroundImage: `url("${video.previewUrl}")` }}
          justifyContent={"end"}
          className="plv-videoitem-image"
        >
          <Stack direction={"row"} justifyContent={"end"}>
            <div className="plv-videoitem-image__duration">{video.duration}</div>
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <h5 className="plv-videoitem-title">{video.title}</h5>
          <div className="plv-videoitem-chname">{video.channel?.name}</div>
        </Stack>
      </Stack>
      <Stack justifyContent={"center"}>
        {isCurrent && (
          <Tooltip title="Сейчас воспроизводится">
            <Stack justifyContent={"end"}>
              <PlayArrow color="success" />
            </Stack>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};

export default VideoItem;
