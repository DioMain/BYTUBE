import { Alert, Grid2, LinearProgress, Stack, TextField, IconButton, Tabs, Tab } from "@mui/material";
import { useRef, useState } from "react";
import { SelectOrderBy } from "@type/SelectOptions";
import { useStores } from "appStoreContext";
import { observer } from "mobx-react-lite";
import { Search } from "@mui/icons-material";
import AuthState from "@type/AuthState";
import QueriesUrls from "@helpers/QeuriesUrls";
import useVideosWithPagination from "@hooks/useVideosWithPagination";
import VideoItem from "./VideoItem";
import StatusBase from "@type/StatusBase";
import VideoModel from "@type/models/VideoModel";
import axios from "axios";
import CommentsViewer from "@components/CommentsViewer";
import ReportView from "./ReportView/intex";
import styles from "./styled";

const VideoControll: React.FC = observer(() => {
  const observeElement = useRef<HTMLDivElement>(null);

  const { user } = useStores();

  const [video, setVideo] = useState<VideoModel | undefined>(undefined);
  const [searchValue, setSearchValue] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const { data, ended, status, refresh } = useVideosWithPagination(observeElement, {
    skip: 0,
    take: 8,
    orderBy: SelectOrderBy.ReportsDesc,
    asAdmin: true,
    searchPattern: searchValue,
    onlyAllAges: false,
  });

  const handleSelectVideo = (videoModel: VideoModel) => {
    setVideo(videoModel);
  };

  const handleDeleteVideo = (videoModel: VideoModel) => {
    axios
      .delete(QueriesUrls.VIDEO_DELETE_BY_ADMIN, {
        params: {
          id: videoModel.id,
        },
      })
      .then(() => {
        setVideo(undefined);
        refresh();
      });
  };

  const getTab = () => {
    switch (tabIndex) {
      case 0:
        return <CommentsViewer video={video!} />;
      case 1:
        return <ReportView video={video!} />;
      default:
        return <></>;
    }
  };

  if (user.status === AuthState.Loading) return <LinearProgress />;

  return (
    <styles.VideoControll>
      <styles.VideoList>
        <Grid2 container spacing={2}>
          <Grid2 size={6}>
            <Stack spacing={1}>
              <Stack direction={"row"} spacing={1}>
                <TextField
                  variant="outlined"
                  placeholder="Поиск"
                  onChange={(evt) => {
                    console.log(evt.target.value);
                    setSearchValue(evt.target.value);
                  }}
                />
                <Stack justifyContent={"center"}>
                  <IconButton
                    onClick={() => {
                      refresh();
                    }}
                  >
                    <Search />
                  </IconButton>
                </Stack>
              </Stack>
              {data.map((item, index) => {
                return (
                  <VideoItem
                    key={`ap-vi-${index}`}
                    video={item}
                    selected={video === item}
                    onSelect={handleSelectVideo}
                    onDelete={handleDeleteVideo}
                  />
                );
              })}
              {status === StatusBase.Loading && <LinearProgress />}
              {ended ? (
                <Alert severity="info" variant="outlined">
                  Больше видео не обнаружено!
                </Alert>
              ) : (
                <div ref={observeElement}></div>
              )}
            </Stack>
          </Grid2>
          <Grid2 size={6}>
            {video !== undefined ? (
              <Stack spacing={2}>
                <Tabs value={tabIndex} onChange={(evt, index) => setTabIndex(index)}>
                  <Tab label="Комментарии" />
                  <Tab label="Жалобы" />
                </Tabs>
                {getTab()}
              </Stack>
            ) : (
              <Alert severity="info" variant="outlined">
                Выберете видео
              </Alert>
            )}
          </Grid2>
        </Grid2>
      </styles.VideoList>
    </styles.VideoControll>
  );
});

export default VideoControll;
