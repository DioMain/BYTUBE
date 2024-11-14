import { Stack } from "@mui/material";
import VideosList from "./VideosList";
import { useState } from "react";
import VideoCreate from "./VideoCreate";

const VideosSettings: React.FC = () => {
  const [page, setPage] = useState(0);

  const getPage = () => {
    switch (page) {
      default:
      case 0:
        return <VideosList setPage={setPage} />;
      case 1:
        return <VideoCreate setPage={setPage} />;
      case 1:
        return <VideoCreate setPage={setPage} />;
    }
  };

  return (
    <Stack className="studiovideowrapper" spacing={3}>
      {getPage()}
    </Stack>
  );
};

export default VideosSettings;
