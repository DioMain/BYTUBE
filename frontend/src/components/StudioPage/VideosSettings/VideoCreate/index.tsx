import { Alert, Button, IconButton, Stack } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import GetFileUrl from "@helpers/GetFileUrl";
import VideoPlayer from "@components/VideoPlayer";
import { UploadFile, Add, Close } from "@mui/icons-material";
import Button0 from "@components/CustomUI/Button0";
import IsRightImageFormat from "@helpers/IsRightImageFormat";
import IsRightVideoFormat from "@helpers/IsRightVideoFormat";
import axios, { AxiosError } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import { useStores } from "appStoreContext";
import ServerError from "@type/ServerError";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { VSEProps } from "../types";
import "./style.scss";
import { LoadingButton } from "@mui/lab";

const VideoCreate: React.FC<VSEProps> = ({ setPage }) => {
  const [fileVideoUrl, setFileVideoUrl] = useState("");
  const [filePreviewUrl, setFilePreviewUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { channel } = useStores();

  const videoInput = useRef<HTMLInputElement>(null);
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

    if (!IsRightVideoFormat(videoInput.current)) {
      setError("Видео не указано или не имеет верный формат!");
      return;
    }

    let formData = new FormData();

    formData.append("Title", nameInput.current?.value!);
    formData.append("Description", descInput.current?.value!);

    tags.forEach((val) => {
      formData.append("Tags", val);
    });

    formData.append("PreviewFile", previewInput.current?.files?.item(0)!);
    formData.append("VideoFile", videoInput.current?.files?.item(0)!);

    setLoading(true);

    axios
      .post(`${QueriesUrls.ADD_NEW_VIDEO}?channelId=${channel.value?.id}`, formData)
      .then(() => {
        window.location.reload();
      })
      .catch((err: AxiosError) => {
        if (err.code === "401") {
          window.location.assign("/App/Main");
        }

        let srvErr = new ServerError(err.response?.data);
        setError(srvErr.getFirstError());

        setLoading(false);
      });
  }, [tags, videoInput, previewInput, nameInput, descInput, setError, setLoading]);

  return (
    <Stack className="studio-videocreate">
      <Stack className="studio-videocreate-preview" spacing={4}>
        <Stack direction={"row"} style={{ marginLeft: "48px" }}>
          <IconButton onClick={() => setPage(0)}>
            <ArrowBackIcon />
          </IconButton>
        </Stack>
        <Stack direction={"row"} justifyContent={"center"}>
          {fileVideoUrl !== "" ? (
            <VideoPlayer className="studio-videocreate-preview__player" url={fileVideoUrl} width="640px" />
          ) : (
            <Stack className="studio-videocreate-preview__notwork">Предпросмотр не доступен</Stack>
          )}
        </Stack>
      </Stack>

      <Stack style={{ margin: "48px", marginTop: "16px" }} spacing={3}>
        <Stack direction={"row"} justifyContent={"center"}>
          <Stack className="studio-videocreate-inputvideo">
            <input
              ref={videoInput}
              type="file"
              accept=".mp4"
              id="inputVFile"
              onChange={() => setFileVideoUrl(GetFileUrl(videoInput.current))}
            />
            <label htmlFor="inputVFile">
              <Button0 text="Выбрать видео" icon={<UploadFile />} />
            </label>
          </Stack>
        </Stack>
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
        <Stack className="studio-videocreate-error">{error !== "" && <Alert severity="error">{error}</Alert>}</Stack>
        <Stack direction={"row"} justifyContent={"end"}>
          <LoadingButton
            variant="contained"
            onClick={confirm}
            color="success"
            loading={loading}
            loadingPosition="start"
          >
            Подтвердить
          </LoadingButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VideoCreate;