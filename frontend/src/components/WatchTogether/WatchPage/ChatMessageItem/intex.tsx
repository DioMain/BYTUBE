import { User } from "@type/models/UserModel";
import { Stack } from "@mui/material";
import W2GChatMessage from "@type/W2GChatMessage";
import PropsBase from "@type/PropsBase";
import styles from "./styled";

interface ChatMessageItemProps extends PropsBase {
  user: User;
  message: W2GChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ className, style, user, message }) => {
  const date = new Date(message.created);

  return (
    <styles.ChatItem className={className} style={style} direction={"row"} spacing={2}>
      <styles.ChatItemIcon style={{ backgroundImage: `url("${user.iconUrl}")` }}></styles.ChatItemIcon>
      <styles.ChatItemContent justifyContent={"space-between"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <h4>{user.name}</h4>
          <div>
            {date.getDay()}.{date.getMonth()}.{date.getFullYear()} {date.getHours()}:{date.getMinutes()}:
            {date.getSeconds()}
          </div>
        </Stack>
        <div>{message.text}</div>
      </styles.ChatItemContent>
    </styles.ChatItem>
  );
};

export default ChatMessageItem;
