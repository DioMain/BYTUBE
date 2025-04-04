import QueriesUrls from "@helpers/QeuriesUrls";
import { Alert, Box, CircularProgress, Modal, Stack, Button } from "@mui/material";
import PlaylistModel from "@type/models/PlaylistModel";
import VideoModel from "@type/models/VideoModel";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import VideoItem from "./VideoItem";
import SortVideosByOrder from "@helpers/SortVideosByOrder";
import { BoxStyled } from "@styles/Common";

interface AHPLM_Props {
  opened: boolean;
  onClose: () => void;
  playlist: PlaylistModel | null;
}

const PlaylistModal: React.FC<AHPLM_Props> = ({ playlist, onClose, opened }) => {
  const [videos, setVideos] = useState<VideoModel[]>([]);

  useEffect(() => {
    if (playlist == null) return;

    axios
      .get(QueriesUrls.GET_PLAYLIST_VIDEOS, {
        params: {
          playlistId: playlist.id,
        },
      })
      .then((res: AxiosResponse) => {
        setVideos(SortVideosByOrder(playlist.playlistItems, res.data));
      });
  }, [playlist]);

  const deleteHandle = () => {
    axios
      .delete(QueriesUrls.PLAYLIST_COMMON, {
        params: {
          id: playlist?.id,
        },
      })
      .then(() => {
        window.location.assign(QueriesUrls.MAIN_PAGE);
      });
  };

  const removeHandle = (vid: string) => {
    axios
      .delete(QueriesUrls.REMOVE_ELEMENT_FROM_PLAYLIST, {
        params: {
          id: playlist?.id,
          vid: vid,
        },
      })
      .then(() => {
        setVideos(videos.filter((item) => item.id !== vid));
      });
  };

  return (
    <Modal open={opened} onClose={onClose} className="createplaylist">
      <BoxStyled sx={{ width: "500px" }}>
        {playlist === null ? (
          <CircularProgress />
        ) : (
          <Stack spacing={3}>
            <h3 style={{ textAlign: "center" }}>{playlist.name}</h3>
            {videos.length !== 0 ? (
              <Stack spacing={1} overflow={"auto"} style={{ maxHeight: "500px" }}>
                {videos.map((item, index) => {
                  return (
                    <VideoItem
                      key={`plm-vi-${index}`}
                      video={item}
                      onClick={() =>
                        window.location.assign(`${QueriesUrls.VIDEO_PAGE}?id=${item.id}&playlistId=${playlist.id}`)
                      }
                      onDelete={() => removeHandle(item.id)}
                    />
                  );
                })}
              </Stack>
            ) : (
              <Alert severity="info" variant="outlined">
                Плейлист пуст
              </Alert>
            )}
            <Stack direction={"row"}>
              <Button variant="contained" color="error" onClick={deleteHandle}>
                Удалить плейлист
              </Button>
            </Stack>
          </Stack>
        )}
      </BoxStyled>
    </Modal>
  );
};

export default PlaylistModal;
