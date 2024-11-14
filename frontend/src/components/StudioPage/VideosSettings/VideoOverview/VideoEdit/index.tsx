import { Alert, Button, IconButton, Stack } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import GetFileUrl from "@helpers/GetFileUrl";
import VideoPlayer from "@components/VideoPlayer";
import { UploadFile, Add, Close } from "@mui/icons-material";
import "./style.scss";
import Button0 from "@components/CustomUI/Button0";
import IsRightImageFormat from "@helpers/IsRightImageFormat";
import IsRightVideoFormat from "@helpers/IsRightVideoFormat";
import axios, { AxiosError } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import { useStores } from "appStoreContext";
import ServerError from "@type/ServerError";

const VideoEdit: React.FC = () => {
  const videoAccesses = ["Для всех", "По ссылке", "Для меня"];

  const { channel, video } = useStores();

  const [filePreviewUrl, setFilePreviewUrl] = useState<string>(video.value?.previewUrl!);
  const [tags, setTags] = useState<string[]>(video.value?.tags!);
  const [error, setError] = useState("");
  const [access, setAccess] = useState("0");

  const previewInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const tagInput = useRef<HTMLInputElement>(null);
  const descInput = useRef<HTMLTextAreaElement>(null);

  const addTag = useCallback(() => {
    if (
      tagInput.current === null ||
      tagInput.current.value === "" ||
      tags.some((val) => val === tagInput.current?.value)
    )
      return;

    setTags([...tags, tagInput.current.value]);
  }, [tags, setTags]);

  const removeTag = useCallback(
    (id: number) => {
      const newtags = tags.filter((val, index) => {
        return index != id;
      });
      setTags([...newtags]);
    },
    [tags, setTags]
  );

  const confirm = useCallback(() => {
    if (nameInput.current?.value === "") {
      setError("Название должно быть указано!");
      return;
    }

    if (!IsRightImageFormat(previewInput.current)) {
      setError("Превью не указано или не имеет верный формат!");
      return;
    }

    let formData = new FormData();

    formData.append("Title", nameInput.current?.value!);
    formData.append("Description", descInput.current?.value!);

    tags.forEach((val) => {
      formData.append("Tags", val);
    });

    formData.append("PreviewFile", previewInput.current?.files?.item(0)!);

    axios
      .put(`${QueriesUrls.ADD_NEW_VIDEO}?channelId=${channel.value?.id}`, formData)
      .then(() => {
        window.location.reload();
      })
      .catch((err: AxiosError) => {
        let srvErr = new ServerError(err.response?.data);

        setError(srvErr.getFirstError());
      });
  }, [tags, previewInput, nameInput, descInput, setError]);

  return (
    <Stack className="studio-videocreate">
      <Stack className="studio-videocreate-preview" justifyContent={"center"} direction={"row"}>
        <VideoPlayer className="studio-videocreate-preview__player" url={video.value?.videoUrl!} width="640px" />
      </Stack>

      <Stack style={{ margin: "48px", marginTop: "16px" }} spacing={3}>
        <Stack className="studio-videocreate-namefield" spacing={1}>
          <h4>Название</h4>
          <Stack direction={"row"}>
            <input ref={nameInput} type="text" />
          </Stack>
        </Stack>
        <Stack className="studio-videocreate-descfield" spacing={1}>
          <h4>Описание</h4>
          <textarea ref={descInput} rows={6}></textarea>
        </Stack>
        <Stack className="studio-videocreate-tags" spacing={1}>
          <h4>Теги</h4>
          <Stack direction={"row"} spacing={2}>
            <input ref={tagInput} type="text" />
            <IconButton onClick={addTag}>
              <Add />
            </IconButton>
          </Stack>
          <Stack direction={"row"} spacing={2} flexWrap={"wrap"}>
            {tags.map((val, index) => {
              return (
                <Stack
                  className="studio-videocreate-tags__item"
                  onClick={() => removeTag(index)}
                  key={`svti_${index}`}
                  direction={"row"}
                  spacing={1}
                >
                  <Stack className="studio-videocreate-tags__item-value" justifyContent={"center"}>
                    #{val}
                  </Stack>
                  <Stack className="studio-videocreate-tags__item-remove" justifyContent={"center"}>
                    <Close />
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <h3>Превью</h3>
          <Stack className="studio-videocreate-previewimg" direction={"row"} justifyContent={"space-between"}>
            <Stack
              className="studio-videocreate-previewimg__image"
              style={{ backgroundImage: `url("${filePreviewUrl}")` }}
              justifyContent={"center"}
            >
              {filePreviewUrl === "" && (
                <Stack direction={"row"} justifyContent={"center"} className="studio-videocreate-previewimg__image-no">
                  <div>Нет изображения</div>
                </Stack>
              )}
            </Stack>
            <Stack justifyContent={"center"} className="studio-videocreate-previewimg__input">
              <input
                ref={previewInput}
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                id="inputPFile"
                onChange={() => setFilePreviewUrl(GetFileUrl(previewInput.current))}
              />
              <label htmlFor="inputPFile">
                <Button0 text="Выбрать фото" icon={<UploadFile />} />
              </label>
            </Stack>
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <h3>Доступ</h3>
          <Stack direction={"row"}>
            <Select value={access} onChange={(evt) => setAccess(evt.target.value)}>
              {videoAccesses.map((val, index) => {
                return (
                  <MenuItem value={index} key={`vc_va_${index}`}>
                    {val}
                  </MenuItem>
                );
              })}
            </Select>
          </Stack>
        </Stack>
        <Stack className="studio-videocreate-error">{error !== "" && <Alert severity="error">{error}</Alert>}</Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant="contained" onClick={undefined} color="error">
            Удалить
          </Button>
          <Button variant="contained" onClick={confirm} color="success">
            Подтвердить
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VideoEdit;
