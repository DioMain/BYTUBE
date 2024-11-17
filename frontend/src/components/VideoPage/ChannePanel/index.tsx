import ChannelModel from "@type/models/ChannelModel";
import PropsBase from "@type/PropsBase";
import { IconButton, Stack, Tooltip } from "@mui/material";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import TurnedInIcon from "@mui/icons-material/TurnedIn";

import "./style.scss";

interface CVProps extends PropsBase {
  channel: ChannelModel;
}

const ChannelPanel: React.FC<CVProps> = ({ channel }) => {
  return (
    <Stack direction={"row"} className="vp-channelview" spacing={1}>
      <Stack className="vp-channelview__image" style={{ backgroundImage: `url("${channel.iconUrl}")` }}></Stack>
      <Stack className="vp-channelview-info">
        <h4>{channel.name}</h4>
        <div>Подписчиков: {channel.subscribes}</div>
      </Stack>
      <Stack justifyContent={"center"}>
        {channel.isSubscripted ? (
          <Tooltip title="Отписаться">
            <IconButton>
              <TurnedInIcon color="success" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Подписаться">
            <IconButton>
              <TurnedInNotIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};

export default ChannelPanel;
