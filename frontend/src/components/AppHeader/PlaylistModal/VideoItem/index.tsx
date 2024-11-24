import React from "react";
import "./style.scss";
import VideoModel from "@type/models/VideoModel";
import { IconButton, Stack } from "@mui/material";
import { Delete } from "@mui/icons-material";

interface PMVI_Props {
  video: VideoModel;
  onClick: () => void;
  onDelete: () => void;
}

const VideoItem: React.FC<PMVI_Props> = ({ video, onClick, onDelete }) => {
  return (
    <Stack direction={"row"} justifyContent={"space-between"} className="plm-videoitem" onClick={onClick}>
      <Stack direction={"row"} spacing={2}>
        <Stack
          style={{ backgroundImage: `url("${video.previewUrl}")` }}
          justifyContent={"end"}
          className="plm-videoitem-image"
        >
          <Stack direction={"row"} justifyContent={"end"}>
            <div className="plm-videoitem-image__duration">{video.duration}</div>
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <h5 className="plm-videoitem-title">{video.title}</h5>
          <div className="plm-videoitem-chname">{video.channel?.name}</div>
        </Stack>
      </Stack>
      <Stack justifyContent={"end"}>
        <Stack direction={"row"} justifyContent={"end"}>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Delete />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VideoItem;
