import { Alert, Box, Container, IconButton, Modal, Stack } from "@mui/material";
import "./styles.scss";
import DrawerOrModalPropsBase from "@type/DrawerOrModalPropsBase";
import VideoModel from "@type/models/VideoModel";
import { useEffect, useRef, useState } from "react";
import useVideosWithPagination from "@hooks/useVideosWithPagination";
import { Search } from "@mui/icons-material";
import { BoxStyled } from "@styles/Common";

interface SelectVideoModalProps extends DrawerOrModalPropsBase {
  onVideoSelected?: (video: VideoModel) => void;
}

const SelectVideoModal: React.FC<SelectVideoModalProps> = ({ opened, onClose, onVideoSelected }) => {
  const observeElement = useRef<HTMLDivElement>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  const [searchText, setSearchText] = useState("");

  const { data, ended, status, refresh } = useVideosWithPagination(observeElement, {
    skip: 0,
    take: 6,
    searchPattern: searchText,
  });

  useEffect(() => {
    refresh();
  }, [searchText]);

  return (
    <Modal open={opened} onClose={onClose}>
      <BoxStyled>
        <Stack className="w2g-svm" spacing={2}>
          <h2 style={{ textAlign: "center" }}>Выберете видео</h2>
          <Stack direction={"row"} spacing={1}>
            <input className="w2g-svm__search" placeholder="Видео..." ref={searchRef}></input>
            <IconButton onClick={() => setSearchText(searchRef.current?.value!)}>
              <Search />
            </IconButton>
          </Stack>
          <Stack spacing={1} className="w2g-svm-list">
            {data.map((video, index) => {
              return (
                <Stack
                  direction={"row"}
                  className="w2g-svm-list-item"
                  spacing={1}
                  key={`video-list-${index}`}
                  onClick={() => {
                    if (onVideoSelected) onVideoSelected(video);
                    if (onClose) onClose();
                  }}
                >
                  <div
                    className="w2g-svm-list-item__prv"
                    style={{ backgroundImage: `url("${video.previewUrl}")` }}
                  ></div>
                  <Stack spacing={1}>
                    <h3>{video.title}</h3>
                    <Stack justifyContent={"space-between"} spacing={1} direction={"row"} style={{ fontSize: "14px" }}>
                      <div>Просмотров: {video.views}</div>
                      <div>Длительность: {video.duration}</div>
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
            {ended && (
              <Alert severity="info" variant="outlined">
                Видео больше не найдено
              </Alert>
            )}
            {!ended && <div ref={observeElement}></div>}
          </Stack>
        </Stack>
      </BoxStyled>
    </Modal>
  );
};

export default SelectVideoModal;
