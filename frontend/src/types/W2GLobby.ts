import { User } from "./models/UserModel";
import W2GChatMessage from "./W2GChatMessage";

interface W2GLobby {
  name: string;

  master: string | null;

  videoId: string | null;

  usersCount: number;

  users?: User[];
  messages?: W2GChatMessage[];

  isPrivate: boolean;
}

export default W2GLobby;
