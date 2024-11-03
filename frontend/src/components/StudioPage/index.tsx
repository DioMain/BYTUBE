import { LinearProgress, Stack } from "@mui/material";
import { observer } from "mobx-react-lite";
import Logo from "@components/Logo";
import useAuth from "@hooks/useAuth";
import { useStores } from "appStoreContext";
import AuthState from "@type/AuthState";

import "./style.scss";
import useProtected from "@hooks/useProtected";
import useOwnChannel from "@hooks/useOwnChannel";
import GetUrlParams from "@helpers/GetUrlParams";
import StatusBase from "@type/StatusBase";

const StudioPage: React.FC = observer(() => {
  const cid = GetUrlParams().get("channelid") as number;

  useAuth();
  useProtected();
  const { status } = useOwnChannel(cid);

  const { user, channel } = useStores();

  if (user.status === AuthState.Loading || status === StatusBase.Loading) return <LinearProgress />;

  if (status === StatusBase.Failed) window.location.assign("/App/Main");

  return (
    <Stack className="studio">
      <Stack direction={"row"} justifyContent={"space-between"} className="studio-header">
        <Logo />
        <Stack direction={"row"} justifyContent={"end"}>
          <div
            className="studio-header-channelicon"
            style={{ backgroundImage: `url("${channel.value?.iconUrl}")` }}
          ></div>
          <Stack justifyContent={"center"} className="studio-header-name">
            <div>{channel.value?.name}</div>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
});

export default StudioPage;
