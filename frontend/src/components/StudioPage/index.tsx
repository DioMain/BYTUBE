import { Box, LinearProgress, Stack, Tab, Tabs } from "@mui/material";
import { observer } from "mobx-react-lite";
import Logo from "@components/Logo";
import useAuth from "@hooks/useAuth";
import { useStores } from "appStoreContext";
import AuthState from "@type/AuthState";
import useProtected from "@hooks/useProtected";
import useOwnChannel from "@hooks/useOwnChannel";
import GetUrlParams from "@helpers/GetUrlParams";
import StatusBase from "@type/StatusBase";
import { useState } from "react";
import ChannelSettings from "./ChannelSettings";

import "./style.scss";
import VideosWrapper from "./VideosWrapper";

const StudioPage: React.FC = observer(() => {
  const cid = GetUrlParams().get("channelid") as number;

  useAuth();
  useProtected();
  const { status } = useOwnChannel(cid);
  const { user, channel } = useStores();

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index: any) => {
    setTabIndex(index);
  };

  const getElementByTab = () => {
    switch (tabIndex) {
      case 0:
        return <VideosWrapper />;
      case 1:
        return <ChannelSettings />;
      default:
        return <></>;
    }
  };

  if (user.status === AuthState.Loading || status === StatusBase.Loading) return <LinearProgress />;

  if (status === StatusBase.Failed) window.location.assign("/App/Main");

  return (
    <Stack className="studio">
      <Stack direction={"row"} justifyContent={"space-between"} className="studio-header">
        <Stack spacing={2} direction={"row"}>
          <Logo />
          <Stack justifyContent={"center"}>
            <h3>Студиа</h3>
          </Stack>
        </Stack>
        <Stack direction={"row"} justifyContent={"end"} spacing={2}>
          <Stack justifyContent={"center"} className="studio-header-name">
            <div>{channel.value?.name}</div>
          </Stack>
          <div
            className="studio-header-channelicon"
            style={{ backgroundImage: `url("${channel.value?.iconUrl}")` }}
          ></div>
        </Stack>
      </Stack>
      <Stack className="studio__tabs" justifyContent={"center"}>
        <Tabs value={tabIndex} onChange={(evt, val) => handleTabChange(val)} variant="standard">
          <Tab label="Видео" />
          <Tab label="Настройки канала" />
        </Tabs>
      </Stack>
      {getElementByTab()}
    </Stack>
  );
});

export default StudioPage;
