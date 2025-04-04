import ChannelModel from "@type/models/ChannelModel";
import PropsBase from "@type/PropsBase";
import { IconButton, Stack, Tooltip } from "@mui/material";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import { useState } from "react";
import axios from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import { useStores } from "appStoreContext";
import AuthState from "@type/AuthState";
import styles from "./styled";

interface CVProps extends PropsBase {
  channel: ChannelModel;
}

const ChannelButton: React.FC<CVProps> = ({ channel }) => {
  const [subscribed, setSubsribed] = useState(channel.isSubscripted);

  const { user } = useStores();

  const handleSubscribe = () => {
    axios
      .post(QueriesUrls.SUB_USER, null, {
        params: {
          id: channel.id,
        },
      })
      .then(() => {
        setSubsribed(true);
      });
  };

  const handleUnsubscribe = () => {
    axios
      .delete(QueriesUrls.SUB_USER, {
        params: {
          id: channel.id,
        },
      })
      .then(() => {
        setSubsribed(false);
      });
  };

  const handleChannelClick = () => {
    window.location.assign(`${QueriesUrls.CHANNEL_PAGE}?id=${channel.id}`);
  };

  return (
    <styles.ChannelView direction={"row"} spacing={1} onClick={handleChannelClick}>
      <styles.ChannelViewImage style={{ backgroundImage: `url("${channel.iconUrl}")` }}></styles.ChannelViewImage>
      <styles.ChannelViewInfo className="info">
        <h4>{channel.name}</h4>
        <div>Подписчиков: {channel.subscribes}</div>
      </styles.ChannelViewInfo>
      <Stack justifyContent={"center"}>
        {subscribed ? (
          <Tooltip title="Отписаться">
            <IconButton
              onClick={(evt) => {
                if (!evt.isPropagationStopped()) evt.stopPropagation();

                handleUnsubscribe();
              }}
            >
              <TurnedInIcon color="success" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Подписаться">
            <IconButton
              onClick={(evt) => {
                if (!evt.isPropagationStopped()) evt.stopPropagation();

                handleSubscribe();
              }}
              disabled={user.status !== AuthState.Authed}
            >
              <TurnedInNotIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </styles.ChannelView>
  );
};

export default ChannelButton;
