import { Stack, Button, Alert } from "@mui/material";
import { useStores } from "appStoreContext";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useCallback, useRef, useState } from "react";
import QueriesUrls from "@helpers/QeuriesUrls";
import GetFileUrl from "@helpers/GetFileUrl";

import "./style.scss";
import IsRightImageFormat from "@helpers/IsRightImageFormat";
import axios, { AxiosError, AxiosResponse } from "axios";
import ServerError from "@type/ServerError";
import styled from "styled-components";
import { TextFieldMixin } from "@styles/Inputs";

const NameInput = styled.input`
  ${TextFieldMixin()}

  width: 25%;
`;

const DescriptionTextArea = styled.textarea`
  ${TextFieldMixin()}
`;

const ChannelSettings: React.FC = () => {
  const { channel } = useStores();

  if (channel.value === undefined) {
    window.location.assign(QueriesUrls.MAIN_PAGE);
    return <></>;
  }

  const iconField = useRef<HTMLInputElement>(null);
  const bannerField = useRef<HTMLInputElement>(null);
  const nameField = useRef<HTMLInputElement>(null);
  const descField = useRef<HTMLTextAreaElement>(null);

  const [iconUrl, setIconUrl] = useState(channel.value.iconUrl);
  const [bannerUrl, setBannerUrl] = useState(channel.value.bannerUrl);
  const [error, setError] = useState("");

  const updateChannel = useCallback(() => {
    if (iconField.current?.files?.item(0) !== null) {
      if (!IsRightImageFormat(iconField.current)) {
        setError("Фото имеет не верный формат");
        return;
      }
    }

    if (bannerField.current?.files?.item(0) !== null) {
      if (!IsRightImageFormat(bannerField.current)) {
        setError("Фото имеет не верный формат");
        return;
      }
    }

    let formData = new FormData();

    formData.append("Name", nameField.current?.value!);
    formData.append("Description", descField.current?.value!);
    formData.append("IconFile", iconField.current?.files?.item(0)!);
    formData.append("BannerFile", bannerField.current?.files?.item(0)!);

    axios
      .put(QueriesUrls.CHANNEL_COMMON, formData, {
        params: {
          id: channel.value?.id,
        },
      })
      .then((res: AxiosResponse) => {
        window.location.reload();
      })
      .catch((err: AxiosError) => {
        if (err.code === "404") {
          setError("Канал не найден!");
        } else {
          let dt = new ServerError(err);

          setError(dt.getFirstError());
        }
      });
  }, [iconField, bannerField, nameField, descField, setError]);

  const deleteChannel = () => {
    axios
      .delete(QueriesUrls.CHANNEL_COMMON, {
        params: {
          id: channel.value?.id,
        },
      })
      .then(() => window.location.assign(QueriesUrls.MAIN_PAGE));
  };

  return (
    <Stack className="settings" spacing={2}>
      <Stack
        className="settings-banner"
        justifyContent={"space-between"}
        style={{ backgroundImage: `url("${bannerUrl}")` }}
      >
        <Stack direction={"row"} spacing={2}>
          <Stack direction={"row"} justifyContent={"center"}>
            <Stack
              justifyContent={"end"}
              className="settings-content-icon"
              style={{ backgroundImage: `url("${iconUrl}")` }}
            >
              <Stack direction={"row"} justifyContent={"end"}>
                <input
                  id="iconField"
                  ref={iconField}
                  accept="image/png, image/jpeg"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(evt) => setIconUrl(GetFileUrl(evt.target))}
                />
                <label htmlFor="iconField" className="settings-content__btn">
                  <FileUploadIcon sx={{ color: "white" }} />
                </label>
              </Stack>
            </Stack>
          </Stack>
          <Stack justifyContent={"start"}>
            <div className="settings-banner__name">{channel.value?.name}</div>
          </Stack>
        </Stack>
        <Stack direction={"row"} justifyContent={"end"}>
          <input
            id="bannerField"
            ref={bannerField}
            type="file"
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            onChange={(evt) => setBannerUrl(GetFileUrl(evt.target))}
          />
          <label htmlFor="bannerField" className="settings-banner__btn">
            <FileUploadIcon sx={{ color: "white" }} />
          </label>
        </Stack>
      </Stack>
      <Stack spacing={2} className="settings-content">
        <Stack spacing={1}>
          <h4>Название канала</h4>
          <Stack direction={"row"}>
            <NameInput type="text" defaultValue={channel.value?.name} ref={nameField} />
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <h4>Описание канала</h4>
          <DescriptionTextArea
            rows={8}
            ref={descField}
            spellCheck
            defaultValue={channel.value?.description}
          ></DescriptionTextArea>
        </Stack>
        <Stack>{error !== "" && <Alert severity="error">{error}</Alert>}</Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant="contained" color="error" onClick={deleteChannel}>
            Удалить канал
          </Button>
          <Button variant="contained" color="success" onClick={updateChannel}>
            Подтвердить изменения
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ChannelSettings;
