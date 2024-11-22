import QueriesUrls from "@helpers/QeuriesUrls";
import { Alert, Box, CircularProgress, Modal, Stack, Button } from "@mui/material";
import PlaylistModel from "@type/models/PlaylistModel";
import VideoModel from "@type/models/VideoModel";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

interface AHPLM_Props {
  opened: boolean;
  onClose: () => void;
  playlist: PlaylistModel | null;
}

const PlaylistListModal: React.FC<AHPLM_Props> = ({ playlist, onClose, opened }) => {
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
        setVideos(res.data);
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
        window.location.reload();
      });
  };

  return (
    <Modal open={opened} onClose={onClose} className="createplaylist">
      <Box
        sx={{
          top: "50%",
          left: "50%",
          position: "absolute",
          backgroundColor: "#404040",
          padding: "12px",
          borderRadius: "8px",
          transform: "translate(-50%, -50%)",
          width: "400px",
        }}
      >
        {playlist === null ? (
          <CircularProgress />
        ) : (
          <Stack spacing={3}>
            <h3 style={{ textAlign: "center" }}>{playlist.name}</h3>
            {videos.length !== 0 ? (
              <Stack spacing={1}>
                {videos.map((item, index) => {
                  return <div>{item.title}</div>;
                })}
              </Stack>
            ) : (
              <Alert severity="info" variant="outlined">
                Плейлист пуст
              </Alert>
            )}
            <Stack direction={"row"}>
              <Button variant="contained" color="error" onClick={deleteHandle}>
                Удалить
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default PlaylistListModal;
