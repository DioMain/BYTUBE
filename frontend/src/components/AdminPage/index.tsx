import Logo from "@components/Logo";
import { Alert, Divider, Grid2, LinearProgress, Stack } from "@mui/material";
import { useStores } from "appStoreContext";
import { observer } from "mobx-react-lite";
import "./style.scss";
import AuthState from "@type/AuthState";
import { Role } from "@type/models/UserModel";
import QueriesUrls from "@helpers/QeuriesUrls";
import useAuth from "@hooks/useAuth";
import useVideosWithPagination from "@hooks/useVideosWithPagination";
import { useRef, useState } from "react";
import { SelectOrderBy } from "@type/SelectOptions";
import VideoItem from "./VideoItem";
import StatusBase from "@type/StatusBase";
import VideoModel from "@type/models/VideoModel";

const AdminPage: React.FC = observer(() => {
  const observeElement = useRef<HTMLDivElement>(null);

  useAuth();

  const { user } = useStores();

  const [video, setVideo] = useState<VideoModel | undefined>(undefined);

  const { data, ended, status } = useVideosWithPagination(observeElement, {
    skip: 0,
    take: 8,
    orderBy: SelectOrderBy.ReportsDesc,
    asAdmin: true,
  });

  const handleSelectVideo = (videoModel: VideoModel) => {
    setVideo(videoModel);
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
              {data.map((item, index) => {
                return (
                  <VideoItem
                    key={`ap-vi-${index}`}
                    video={item}
                    selected={video === item}
                    onSelect={handleSelectVideo}
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
              <Stack>{video.title}</Stack>
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
