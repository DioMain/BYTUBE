import { Stack } from "@mui/material";
import VideosList from "./VideosList";
import { useState } from "react";
import VideoCreate from "./VideoCreate";
import VideoOverview from "./VideoOverview";

const VideosSettings: React.FC = () => {
  const [page, setPage] = useState(0);

  const getPage = () => {
    switch (page) {
      default:
      case 0:
        return <VideosList setPage={setPage} />;
      case 1:
        return <VideoCreate setPage={setPage} />;
      case 2:
        return <VideoOverview setPage={setPage} />;
    }
  };

  return <Stack spacing={3}>{getPage()}</Stack>;
};

export default VideosSettings;
