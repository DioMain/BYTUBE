import AdminControllDTO from "@type/ChannelControllDTO";
import styles from "./styled";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { Block, Delete, Lock } from "@mui/icons-material";
import Unblock from "@mui/icons-material/LockOpen";
import { ChannelStatus } from "@type/models/ChannelModel";
import axios from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";

interface ChannelItemProps {
  item: AdminControllDTO;
  onClick: (value: AdminControllDTO) => void;
  onItemChanged: (value: AdminControllDTO) => void;
  onItemDeleted: (value: AdminControllDTO) => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ item, onClick, onItemChanged, onItemDeleted }) => {
  const created = new Date(item.channel.created!);

  const setChannelStatus = (status: ChannelStatus) => {
    axios
      .put(QueriesUrls.SET_CHANNEL_STATUS_BY_ADMIN, null, {
        params: {
          id: item.channel.id,
          status: status,
        },
      })
      .then(() => {
        const value = item;
        value.channel.status = status;

        onItemChanged(value);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onUnblockHandle = () => {
    setChannelStatus(ChannelStatus.Normal);
  };

  const onLimitHandle = () => {
    setChannelStatus(ChannelStatus.Limited);
  };

  const onBlockHandle = () => {
    setChannelStatus(ChannelStatus.Blocked);
  };

  const onDeleteHandle = () => {
    axios
      .delete(QueriesUrls.DELETE_CHANNEL_BY_ADMIN, {
        params: {
          id: item.channel.id,
        },
      })
      .then(() => {
        onItemDeleted(item);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <styles.ChannelItem direction={"row"} spacing={2} onClick={() => onClick(item)}>
      <styles.Icon style={{ backgroundImage: `url(${item.channel.iconUrl})` }} />
      <Stack style={{ width: "100%" }} spacing={1}>
        <Stack justifyContent={"space-between"} direction={"row"}>
          <h3>{item.channel.name}</h3>
          <div>
            {created.getDate()}.{created.getMonth() + 1}.{created.getFullYear()}
          </div>
        </Stack>

        <p>{item.channel.description}</p>

        <Stack direction={"row"} justifyContent={"end"}>
          {(item.channel.status === ChannelStatus.Limited || item.channel.status === ChannelStatus.Blocked) && (
            <Tooltip title="Разблокировать">
              <IconButton color="success" onClick={onUnblockHandle}>
                <Unblock />
              </IconButton>
            </Tooltip>
          )}

          {item.channel.status === ChannelStatus.Normal && (
            <Tooltip title="Ограничить">
              <IconButton color="warning" onClick={onLimitHandle}>
                <Lock />
              </IconButton>
            </Tooltip>
          )}

          {item.channel.status === ChannelStatus.Limited && (
            <Tooltip title="Заблокировать" onClick={onBlockHandle}>
              <IconButton color="error">
                <Block />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Удалить">
            <IconButton
              color="error"
              onClick={(evt) => {
                if (!evt.isPropagationStopped()) evt.stopPropagation();

                onDeleteHandle();
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </styles.ChannelItem>
  );
};

export default ChannelItem;
