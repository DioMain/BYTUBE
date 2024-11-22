import QueriesUrls from "@helpers/QeuriesUrls";
import { Lock, PlaylistPlay } from "@mui/icons-material";
import { Box, Modal, Stack } from "@mui/material";
import PlaylistModel, { PlaylistAccess } from "@type/models/PlaylistModel";
import VideoModel from "@type/models/VideoModel";
import { useStores } from "appStoreContext";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import "./styles.scss";
import AuthState from "@type/AuthState";

interface ARPM_Props {
  opened: boolean;
  onClose: () => void;
  video: VideoModel;
}

const AddToPlaylistModal: React.FC<ARPM_Props> = ({ opened, onClose, video }) => {
  const { user } = useStores();

  const [playlists, setPlaylists] = useState<PlaylistModel[]>([]);

  useEffect(() => {
    if (user.status !== AuthState.Authed) return;

    axios.get(QueriesUrls.GET_USER_PLAYLISTS).then((res: AxiosResponse) => {
      setPlaylists(res.data);
    });
  }, []);

  const addHandle = (playlist: number) => {
    axios
      .post(QueriesUrls.ADD_ELEMENT_TO_PLAYLIST, null, {
        params: {
          id: playlist,
          vid: video.id,
        },
      })
      .then(() => window.location.reload());
  };

  return (
    <Modal open={opened} onClose={onClose} className="addtoplaylist">
      <Box
        sx={{
          top: "50%",
          left: "50%",
          position: "absolute",
          backgroundColor: "#404040",
          padding: "12px",
          borderRadius: "8px",
          transform: "translate(-50%, -50%)",
          width: "300px",
        }}
      >
        <Stack spacing={2}>
          <h5 style={{ textAlign: "center" }}>Плейлисты</h5>
          {playlists.map((playlist, index) => {
            const hasVideo = playlist.playlistItems.some((item) => item.videoId === video.id);

            return (
              <button
                key={`AddToPlaylistModal-item-${index}`}
                className="addtoplaylist__item"
                disabled={hasVideo}
                onClick={() => addHandle(playlist.id)}
              >
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Stack spacing={1} direction={"row"}>
                    {hasVideo ? <PlaylistAddCheckIcon color="success" /> : <PlaylistAddIcon />}

                    <Stack justifyContent={"center"}>
                      <div>{playlist.name}</div>
                    </Stack>
                  </Stack>
                  {playlist.access === PlaylistAccess.Private && (
                    <Stack justifyContent={"center"} style={{ marginRight: "8px" }}>
                      <Lock fontSize="small" />
                    </Stack>
                  )}
                </Stack>
              </button>
            );
          })}
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddToPlaylistModal;
