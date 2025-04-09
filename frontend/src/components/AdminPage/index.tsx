import Logo from "@components/Logo";
import { Alert, Divider, Grid2, LinearProgress, Stack, TextField, IconButton, Tabs, Tab } from "@mui/material";
import { useStores } from "appStoreContext";
import { observer } from "mobx-react-lite";
import "./style.scss";
import AuthState from "@type/AuthState";
import { Role } from "@type/models/UserModel";
import QueriesUrls from "@helpers/QeuriesUrls";
import useAuth from "@hooks/useAuth";
import useVideosWithPagination from "@hooks/useVideosWithPagination";
import { useRef, useState } from "react";
import SelectOptions, { SelectOrderBy } from "@type/SelectOptions";
import VideoItem from "./VideoItem";
import StatusBase from "@type/StatusBase";
import VideoModel from "@type/models/VideoModel";
import axios from "axios";
import { Search } from "@mui/icons-material";
import CommentsViewer from "@components/CommentsViewer";
import ReportView from "./ReportView/intex";
import useProtected from "@hooks/useProtected";

const AdminPage: React.FC = observer(() => {
  const observeElement = useRef<HTMLDivElement>(null);

  useAuth();
  useProtected();

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

  if ((user.status === AuthState.Authed && user.value?.role !== Role.Admin) || user.status === AuthState.NotAuthed)
    window.location.assign(QueriesUrls.MAIN_PAGE);

  return (
    <Stack className="admin">
      <Stack direction={"row"} justifyContent={"space-between"} className="admin-header">
        <Stack spacing={2} direction={"row"}>
          <Logo />
          <Stack justifyContent={"center"}>
            <h3>Панель администратора</h3>
          </Stack>
        </Stack>
        <Stack direction={"row"} justifyContent={"end"} spacing={2}>
          <Stack justifyContent={"center"} className="admin-header-name">
            <div>{user.value?.name}</div>
          </Stack>
          <div className="admin-header-usericon" style={{ backgroundImage: `url("${user.value?.iconUrl}")` }}></div>
        </Stack>
      </Stack>
      <div className="admin-videolist">
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
      </div>
    </Stack>
  );
});

export default AdminPage;
