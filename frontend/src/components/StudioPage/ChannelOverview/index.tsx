import { observer } from "mobx-react-lite";
import styles from "./styled";
import { useStores } from "appStoreContext";
import { Stack } from "@mui/material";
import { ChannelStatus } from "@type/models/ChannelModel";

const ChannelOverview: React.FC = observer(() => {
  const { channel } = useStores();

  return (
    <styles.ChannelOverview>
      <h1>{channel.value?.name}</h1>

      <Stack justifyContent={"center"} spacing={1}>
        <h2 style={{ textAlign: "center" }}>Состояние канала</h2>
        <Stack justifyContent={"center"} direction={"row"}>
          <styles.VideoStatusGreen
            style={{ backgroundColor: `${channel.value?.status === ChannelStatus.Normal ? "green" : "gainsboro"}` }}
          />
          <styles.VideoStatusYellow
            style={{ backgroundColor: `${channel.value?.status === ChannelStatus.Limited ? "gold" : "gainsboro"}` }}
          />
          <styles.VideoStatusRed
            style={{ backgroundColor: `${channel.value?.status === ChannelStatus.Blocked ? "red" : "gainsboro"}` }}
          />
        </Stack>
        <div style={{ textAlign: "center" }}>
          {channel.value?.status === ChannelStatus.Normal && "Хорошее"}
          {channel.value?.status === ChannelStatus.Limited && "Ограничен"}
          {channel.value?.status === ChannelStatus.Blocked && "Заблокирован"}
        </div>
      </Stack>
    </styles.ChannelOverview>
  );
});

export default ChannelOverview;
