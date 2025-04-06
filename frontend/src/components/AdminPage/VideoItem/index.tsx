import QueriesUrls from "@helpers/QeuriesUrls";
import { Stack, Tooltip, IconButton } from "@mui/material";
import VideoModel, { Status } from "@type/models/VideoModel";
import BlockIcon from "@mui/icons-material/Block";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./style.scss";
import { useState } from "react";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import axios from "axios";
import ImageWithDuration from "@components/ImageWithDuration";

interface APVI_Props {
  video: VideoModel;
  selected: boolean;
  onSelect?: (video: VideoModel) => void;
  onDelete?: (video: VideoModel) => void;
}

const VideoItem: React.FC<APVI_Props> = ({ video, selected, onSelect, onDelete }) => {
  const [blocked, setBlocked] = useState(video.videoStatus === Status.Blocked);

  const selectHandle = () => {
    if (onSelect !== undefined) onSelect(video);
  };

  const deleteHandle = () => {
    if (onDelete !== undefined) onDelete(video);
  };

  const handleBlockUnblock = () => {
    axios
      .put(QueriesUrls.VIDEO_BLOCK_BY_ADMIN, null, {
        params: {
          id: video.id,
        },
      })
      .then(() => {
        setBlocked(!blocked);
      });
  };

  return (
    <Stack
      className={`admin-videoitem ${selected ? "admin-videoitem-selected" : ""}`}
      direction={"row"}
      spacing={2}
      onClick={selectHandle}
    >
      <ImageWithDuration duration={video.duration} previewUrl={video.previewUrl} aspect={0.75} />
      <Stack spacing={1}>
        <h3>{video.title}</h3>
        <a className="admin-videoitem-channel" href={`${QueriesUrls.CHANNEL_PAGE}?id=${video.channel?.id}`}>
          {video.channel?.name}
        </a>
        <div className="admin-videoitem-reportscounter">Количество жалоб: {video.reportsCount}</div>
        <Stack direction={"row"} spacing={1}>
          {blocked ? (
            <Tooltip title="Разблокировать">
              <IconButton
                color="success"
                onClick={(evt) => {
                  if (evt.isPropagationStopped()) evt.stopPropagation();

                  handleBlockUnblock();
                }}
              >
                <LockOpenIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Заблокировать">
              <IconButton
                color="error"
                onClick={(evt) => {
                  if (evt.isPropagationStopped()) evt.stopPropagation();

                  handleBlockUnblock();
                }}
              >
                <BlockIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Удалить" color="error">
            <IconButton
              onClick={(evt) => {
                if (evt.isPropagationStopped()) evt.stopPropagation();

                deleteHandle();
              }}
            >
              <DeleteForeverIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Перейти" color="default">
            <IconButton
              onClick={(evt) => {
                if (evt.isPropagationStopped()) evt.stopPropagation();

                window.open(`${QueriesUrls.VIDEO_PAGE}?id=${video.id}`);
              }}
            >
              <OpenInNewIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VideoItem;
