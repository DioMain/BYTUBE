interface W2GLobby {
  name: string;

  master: string | null;

  videoId: string | null;

  usersCount: number;

  users?: string[];

  isPrivate: boolean;
}

export default W2GLobby;
