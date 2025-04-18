import React from "react";
import VideoModel from "@type/models/VideoModel";
import { IconButton, Stack } from "@mui/material";
import { Delete } from "@mui/icons-material";
import styles from "./styled";

interface PMVI_Props {
  video: VideoModel;
  onClick: () => void;
  onDelete: () => void;
}

const VideoItem: React.FC<PMVI_Props> = ({ video, onClick, onDelete }) => {
  return (
    <styles.PlaylistModalItem direction={"row"} justifyContent={"space-between"} onClick={onClick}>
      <Stack direction={"row"} spacing={2}>
        <styles.ItemImage style={{ backgroundImage: `url("${video.previewUrl}")` }} justifyContent={"end"}>
          <Stack direction={"row"} justifyContent={"end"}>
            <styles.ItemImageDuration>{video.duration}</styles.ItemImageDuration>
          </Stack>
        </styles.ItemImage>
        <Stack spacing={1}>
          <h5>{video.title}</h5>
          <styles.ItemChannelName>{video.channel?.name}</styles.ItemChannelName>
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
    </styles.PlaylistModalItem>
  );
};

export default VideoItem;
