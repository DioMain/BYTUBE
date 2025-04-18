import { Alert, LinearProgress, Stack } from "@mui/material";
import VideoElement from "./VideoElement";
import { useEffect, useRef } from "react";
import useVideosWithPagination from "@hooks/useVideosWithPagination";
import StatusBase from "@type/StatusBase";
import { useStores } from "appStoreContext";
import { MainPageFilter } from "@stores/SearchDataStore";
import { SelectOrderBy } from "@type/SelectOptions";
import { observer } from "mobx-react-lite";

const VideoMain: React.FC = observer(() => {
  const observeElement = useRef<HTMLDivElement>(null);

  const { searchData } = useStores();

  const { data, ended, status, refresh } = useVideosWithPagination(observeElement, {
    skip: 0,
    take: 12,
    favorite: searchData.mainPageFilter === MainPageFilter.Favorite,
    subscribes: searchData.mainPageFilter === MainPageFilter.Subs,
    orderBy: searchData.mainPageFilter === MainPageFilter.Subs ? SelectOrderBy.CreationDesc : SelectOrderBy.None,
    onlyAllAges: false,
  });

  useEffect(() => {
    refresh();
  }, [searchData.mainPageFilter]);

  return (
    <Stack spacing={4} style={{ padding: "16px" }}>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        {data.map((val, index) => {
          return <VideoElement key={`VE${index}`} video={val} />;
        })}
      </div>
      {status === StatusBase.Loading && <LinearProgress />}
      {ended && (
        <Alert severity="info" variant="outlined">
          Больше видео не обнаружено!
        </Alert>
      )}
      {!ended && <div ref={observeElement}></div>}
    </Stack>
  );
});

export default VideoMain;
