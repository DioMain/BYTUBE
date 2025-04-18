import AdminControllDTO from "@type/AdminControllDTO";
import styles from "./styled";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { Block, Delete, Lock } from "@mui/icons-material";
import Unblock from "@mui/icons-material/LockOpen";

interface ChannelItemProps {
  item: AdminControllDTO;
  onClick: (value: AdminControllDTO) => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ item, onClick }) => {
  const created = new Date(item.channel.created!);

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
          <Tooltip title="Разблокировать">
            <IconButton color="success">
              <Unblock />
            </IconButton>
          </Tooltip>

          <Tooltip title="Ограничить">
            <IconButton color="warning">
              <Lock />
            </IconButton>
          </Tooltip>

          <Tooltip title="Заблокировать">
            <IconButton color="error">
              <Block />
            </IconButton>
          </Tooltip>

          <Tooltip title="Удалить">
            <IconButton color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </styles.ChannelItem>
  );
};

export default ChannelItem;
