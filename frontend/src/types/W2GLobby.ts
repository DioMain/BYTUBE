import { User } from "./models/UserModel";

interface W2GLobby {
  name: string;

  master: string | null;

  videoId: string | null;

  usersCount: number;

  users?: User[];

  isPrivate: boolean;
}

export default W2GLobby;
