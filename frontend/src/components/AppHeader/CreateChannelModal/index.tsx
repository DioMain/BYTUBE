import { IconButton, Modal, Stack, Button } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { BoxStyled } from "@styles/Common";
import { TextFieldMixin } from "@styles/Inputs";
import axios, { AxiosError } from "axios";
import PropsBase from "@type/PropsBase";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import GetFileUrl from "@helpers/GetFileUrl";
import QueriesUrls from "@helpers/QeuriesUrls";
import IsRightImageFormat from "@helpers/IsRightImageFormat";
import ServerError from "@type/ServerError";
import styled from "styled-components";
import "./style.scss";

interface CCMProps extends PropsBase {
  isOpened: boolean;
  closeCallback?: () => void;
}

const ChannelNameInput = styled.input`
  ${TextFieldMixin()}
`;

const ChannelDescriptionTextArea = styled.textarea`
  ${TextFieldMixin()}
`;

const CreateChannelModal: React.FC<CCMProps> = ({ isOpened, closeCallback }) => {
  const iconFileRef = useRef<HTMLInputElement | null>(null);
  const bannerFileRef = useRef<HTMLInputElement | null>(null);
  const nameFieldRef = useRef<HTMLInputElement | null>(null);
  const descriptionFieldRef = useRef<HTMLTextAreaElement | null>(null);

  const [previewIcon, setPreviewIcon] = useState("");
  const [previewBanner, setPreviewBanner] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = useCallback(() => {
    let form = new FormData();

    form.append("Name", nameFieldRef.current?.value!);
    form.append("Description", descriptionFieldRef.current?.value!);
    form.append("IconFile", iconFileRef.current?.files?.item(0)!);
    form.append("BannerFile", bannerFileRef.current?.files?.item(0)!);

    if (!IsRightImageFormat(bannerFileRef.current) || !IsRightImageFormat(iconFileRef.current)) {
      setError("Фаил не указан или имеет не верный формат!");
      return;
    }

    axios
      .post(QueriesUrls.CHANNEL_COMMON, form)
      .then(() => {
        window.location.reload();
      })
      .catch((err: AxiosError) => {
        let serverError = new ServerError(err.response?.data);

        setError(serverError.getFirstError());
      });
  }, [nameFieldRef, descriptionFieldRef, iconFileRef, bannerFileRef]);

  const handleClickIcon = () => {
    iconFileRef.current?.click();
  };

  const handleClickBanner = () => {
    bannerFileRef.current?.click();
  };

  const handleIconFileChanged = () => {
    setPreviewIcon(GetFileUrl(iconFileRef.current));
  };

  const handleBannerFileChanged = () => {
    setPreviewBanner(GetFileUrl(bannerFileRef.current));
  };

  return (
    <Modal open={isOpened} onClose={closeCallback}>
      <BoxStyled sx={{ width: "60%" }}>
        <Stack spacing={2} className="createchannel">
          <h2 className="createchannel-title">Создание канала</h2>
          <Stack spacing={1}>
            <h4>Баннер</h4>
            <Stack
              className="createchannel-banner"
              justifyContent={"end"}
              style={{ backgroundImage: `url("${previewBanner}")` }}
            >
              <Stack direction={"row"} justifyContent={"end"}>
                <IconButton onClick={handleClickBanner}>
                  <FileUploadIcon />
                </IconButton>
                <input
                  ref={bannerFileRef}
                  className="createchannel__inputfile"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleBannerFileChanged}
                />
              </Stack>
            </Stack>
          </Stack>
          <Stack>
            <h4>Иконка</h4>
            <Stack direction={"row"} justifyContent={"center"}>
              <Stack
                className="createchannel-icon"
                justifyContent={"end"}
                style={{ backgroundImage: `url("${previewIcon}")` }}
              >
                <Stack direction={"row"} justifyContent={"end"}>
                  <IconButton onClick={handleClickIcon}>
                    <FileUploadIcon />
                  </IconButton>
                  <input
                    ref={iconFileRef}
                    className="createchannel__inputfile"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleIconFileChanged}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack>
            <h4>Название канала</h4>
            <Stack direction={"row"}>
              <ChannelNameInput ref={nameFieldRef} type="text" />
            </Stack>
          </Stack>
          <Stack>
            <h4>Описание</h4>
            <ChannelDescriptionTextArea
              ref={descriptionFieldRef}
              rows={4}
              maxLength={500}
              spellCheck={true}
            ></ChannelDescriptionTextArea>
          </Stack>
          <Stack direction="row" justifyContent={"end"}>
            <Button variant="contained" color="success" onClick={handleConfirm}>
              Подтвердить
            </Button>
          </Stack>
          <h5 style={{ textAlign: "center", color: "red" }}>{error}</h5>
        </Stack>
      </BoxStyled>
    </Modal>
  );
};

export default CreateChannelModal;
