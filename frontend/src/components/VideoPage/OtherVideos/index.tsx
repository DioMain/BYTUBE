import { Alert, LinearProgress, Stack } from "@mui/material";
import StatusBase from "@type/StatusBase";
import VideoElement from "../VideoElement";
import { useRef } from "react";
import useVideosWithPagination from "@hooks/useVideosWithPagination";

const OtherVideos: React.FC<{ videoId: string }> = ({ videoId }) => {
  const observeElement = useRef<HTMLDivElement>(null);

  const { data, ended, status } = useVideosWithPagination(observeElement, {
    skip: 0,
    take: 8,
    ignore: [videoId],
  });

  return (
    <Stack spacing={1}>
      {data.map((val, index) => {
        return (
          <Stack key={`vp-ov-${index}`}>
            <VideoElement video={val} />
          </Stack>
        );
      })}
      {status === StatusBase.Loading && <LinearProgress />}
      {ended && <Alert severity="info">Больше видео не обнаружено!</Alert>}
      {!ended && <div ref={observeElement}></div>}
    </Stack>
  );
};

export default OtherVideos;
