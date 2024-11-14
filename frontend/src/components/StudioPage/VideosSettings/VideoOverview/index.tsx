import { Stack, Tab, Tabs, IconButton } from "@mui/material";
import { useState } from "react";
import VideoStats from "./VideoStats";
import VideoEdit from "./VideoEdit";
import CommentsOverview from "./CommentsOverview";
import { VSEProps } from "../types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
    <Stack spacing={2}>
      <Stack direction={"row"} justifyContent={"center"}>
        <Tabs value={tabIndex} onChange={(evt, val) => setTabIndex(val)}>
          <Tab title="Обзор"></Tab>
          <Tab title="Редактирование"></Tab>
          <Tab title="Комметарии"></Tab>
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
