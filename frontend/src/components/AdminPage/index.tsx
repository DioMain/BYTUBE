import { observer } from "mobx-react-lite";
import { useStores } from "appStoreContext";
import { useEffect, useState } from "react";
import { Stack, Tab, Tabs } from "@mui/material";
import { Role } from "@type/models/UserModel";
import useAuth from "@hooks/useAuth";
import useProtected from "@hooks/useProtected";
import styles from "./styled";
import Logo from "@components/Logo";
import AuthState from "@type/AuthState";
import VideoControll from "./VideoControll";
import ChannelControll from "./ChannelControll";

const AdminPage: React.FC = observer(() => {
  useAuth();
  useProtected();

  const { user } = useStores();

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (user.status === AuthState.Authed && user.value?.role !== Role.Admin) {
      window.location.assign("/App/Main");
    }
  }, [user.status]);

  const getTab = () => {
    switch (tabIndex) {
      case 0:
        return <VideoControll />;
      case 1:
        return <ChannelControll />;
    }
  };

  return (
    <Stack>
      <styles.Header direction={"row"} justifyContent={"space-between"}>
        <Stack spacing={2} direction={"row"}>
          <Logo />
          <Stack justifyContent={"center"}>
            <h3>Панель администратора</h3>
          </Stack>
        </Stack>
        <Stack direction={"row"} justifyContent={"end"} spacing={2}>
          <styles.HeaderName justifyContent={"center"}>{user.value?.name}</styles.HeaderName>
          <styles.HeaderUserIcon style={{ backgroundImage: `url("${user.value?.iconUrl}")` }} />
        </Stack>
      </styles.Header>
      <styles.StyledTabs direction={"row"}>
        <Tabs value={tabIndex} onChange={(evt, value) => setTabIndex(value)}>
          <Tab label="Видео" />
          <Tab label="Каналы" />
        </Tabs>
      </styles.StyledTabs>
      {getTab()}
    </Stack>
  );
});

export default AdminPage;
