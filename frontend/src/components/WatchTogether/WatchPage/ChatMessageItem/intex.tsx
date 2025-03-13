import PropsBase from "@type/PropsBase";
import "./styles.scss";
import { User } from "@type/models/UserModel";
import { Stack } from "@mui/material";

interface ChatMessageItemProps extends PropsBase {
  user: User;
  message: string;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ className, style, user, message }) => {
  return (
    <Stack className={`w2g-chat-item ${className}`} style={style} direction={"row"} spacing={2}>
      <Stack className="w2g-chat-item__icon" style={{ backgroundImage: `url("${user.iconUrl}")` }}></Stack>
      <Stack justifyContent={"space-between"}>
        <h5>{user.name}</h5>
        <div>{message}</div>
      </Stack>
    </Stack>
  );
};

export default ChatMessageItem;
