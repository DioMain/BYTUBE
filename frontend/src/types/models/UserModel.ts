enum Role {
  User = 0,
  Admin = 1,
}

interface User {
  id: number;
  name: string;
  email?: string;
  role?: Role;

  iconUrl: string;
}

export { Role, User };
