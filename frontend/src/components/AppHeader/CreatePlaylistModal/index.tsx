import { Box, MenuItem, Modal, Select, Stack, Button, Alert } from "@mui/material";
import styles from "./styled";
import { useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import ServerError from "@type/ServerError";
import { BoxStyled } from "@styles/Common";

interface APCPM_Props {
  opened: boolean;
  onClose: () => void;
}

const CreatePlaylistModal: React.FC<APCPM_Props> = ({ opened, onClose }) => {
  const playlistAccesses = ["Общий", "Частный"];

  const nameField = useRef<HTMLInputElement>(null);

  const [access, setAccess] = useState("0");
  const [error, setError] = useState("");

  const CreatePlaylist = () => {
    if (nameField.current?.value === "") {
      setError("Поле название не должно быть пустое");
      return;
    }

    axios
      .post(QueriesUrls.PLAYLIST_COMMON, {
        Name: nameField.current?.value,
        Access: Number.parseInt(access),
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err: AxiosError) => {
        if (err.code === "404") {
          window.location.reload();
        } else {
          const Error = new ServerError(err.response?.data);

          setError(Error.getFirstError());
        }
      });
  };

  return (
    <Modal open={opened} onClose={onClose}>
      <BoxStyled>
        <Stack spacing={2}>
          <h2 style={{ textAlign: "center" }}>Создание Плейлиста</h2>
          <Stack spacing={1}>
            <h4>Название</h4>
            <Stack direction={"row"}>
              <styles.NameInput type="text" ref={nameField} placeholder="Плейлист..." />
            </Stack>
          </Stack>
          {/* <Stack spacing={1}>
            <h4>Доступ</h4>
            <Stack direction={"row"}>
              <Select value={access} onChange={(evt) => setAccess(evt.target.value)}>
                {playlistAccesses.map((item, index) => {
                  return (
                    <MenuItem value={index} key={`cpm-access-select-${index}`}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </Stack>
          </Stack> */}
          <Stack direction={"row"} justifyContent={"end"}>
            <Button variant="contained" color="success" onClick={CreatePlaylist}>
              Подтвердить
            </Button>
          </Stack>
          {error !== "" && (
            <Alert severity="error" variant="outlined">
              {error}
            </Alert>
          )}
        </Stack>
      </BoxStyled>
    </Modal>
  );
};

export default CreatePlaylistModal;
