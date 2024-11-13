import { Stack } from "@mui/material";
import VideosOverview from "./VideoOverview";
import { useState } from "react";
import VideoCreate from "./VideoCreate";

const VideosSettings: React.FC = () => {
  const [page, setPage] = useState(0);

  const getPage = () => {
    switch (page) {
      case 0:
        return <VideosOverview setPage={setPage} />;
      case 1:
        return <VideoCreate />;
      case 2:
        return <VideosOverview setPage={setPage} />;
    }
  };

  return (
    <Stack className="studiovideowrapper" spacing={3}>
      {getPage()}
    </Stack>
  );
};

export default VideosSettings;
