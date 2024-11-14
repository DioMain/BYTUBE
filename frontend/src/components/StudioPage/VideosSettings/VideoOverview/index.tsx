import { Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import VideoStats from "./VideoStats";
import VideoEdit from "./VideoEdit";

const VideoOverview: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const getTabPage = () => {
    switch (tabIndex) {
      default:
      case 0:
        return <VideoStats />;
      case 1:
        return <VideoEdit />;
    }
  };

  return (
    <Stack>
      <Stack direction={"row"} justifyContent={"center"}>
        <Tabs value={tabIndex} onChange={(evt, val) => setTabIndex(val)}>
          <Tab title="Обзор"></Tab>
          <Tab title="Редактирование"></Tab>
        </Tabs>
      </Stack>
      <Stack>{getTabPage()}</Stack>
    </Stack>
  );
};

export default VideoOverview;
