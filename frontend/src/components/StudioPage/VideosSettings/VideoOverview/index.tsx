import { Stack, Tab, Tabs, IconButton } from "@mui/material";
import { useState } from "react";
import VideoStats from "./VideoStats";
import VideoEdit from "./VideoEdit";
import CommentsOverview from "./CommentsOverview";
import { VSEProps } from "../types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import "./style.scss";

const VideoOverview: React.FC<VSEProps> = ({ setPage }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const getTabPage = () => {
    switch (tabIndex) {
      default:
      case 0:
        return <VideoStats />;
      case 1:
        return <VideoEdit />;
      case 2:
        return <CommentsOverview />;
    }
  };

  return (
    <Stack spacing={2} className="studio-voverview">
      <Stack direction={"row"} justifyContent={"center"} className="studio-voverview__tabs">
        <Tabs value={tabIndex} onChange={(evt, val) => setTabIndex(val)}>
          <Tab label="Обзор"></Tab>
          <Tab label="Редактирование"></Tab>
          <Tab label="Комметарии"></Tab>
        </Tabs>
      </Stack>
      <Stack direction={"row"}>
        <IconButton onClick={() => setPage(0)}>
          <ArrowBackIcon />
        </IconButton>
      </Stack>
      <Stack>{getTabPage()}</Stack>
    </Stack>
  );
};

export default VideoOverview;
