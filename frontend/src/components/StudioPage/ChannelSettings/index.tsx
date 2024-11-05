import { Stack, IconButton, Button } from "@mui/material";
import { useStores } from "appStoreContext";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import "./style.scss";

const ChannelSettings: React.FC = () => {
  const { channel } = useStores();

  return (
    <Stack className="settings" spacing={2}>
      <Stack
        className="settings-banner"
        justifyContent={"space-between"}
        style={{ backgroundImage: `url("${channel.value?.bannerUrl}")` }}
      >
        <Stack direction={"row"} spacing={2}>
          <Stack direction={"row"} justifyContent={"center"}>
            <Stack
              justifyContent={"end"}
              className="settings-content-icon"
              style={{ backgroundImage: `url("${channel.value?.iconUrl}")` }}
            >
              <Stack direction={"row"} justifyContent={"end"}>
                <div className="settings-content__btn">
                  <IconButton>
                    <FileUploadIcon />
                  </IconButton>
                </div>
                <input type="file" style={{ display: "none" }} />
              </Stack>
            </Stack>
          </Stack>
          <Stack justifyContent={"start"}>
            <div className="settings-banner__name">{channel.value?.name}</div>
          </Stack>
        </Stack>
        <Stack direction={"row"} justifyContent={"end"}>
          <div className="settings-banner__btn">
            <IconButton>
              <FileUploadIcon />
            </IconButton>
          </div>
          <input type="file" style={{ display: "none" }} />
        </Stack>
      </Stack>
      <Stack spacing={3} className="settings-content">
        <h4>Название канала</h4>
        <Stack direction={"row"}>
          <input className="settings-content__namefield" type="text" value={channel.value?.name} />
        </Stack>
        <h4>Описание канала</h4>
        <textarea className="settings-content__descriptionfield">{channel.value?.description}</textarea>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant="contained" color="error">
            Удалить канал
          </Button>
          <Button variant="contained" color="success">
            Подтвердить изменения
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ChannelSettings;
