enum Role {
  User = 0,
  Admin = 1,
}

interface User {
  id: string;
  name: string;
  email?: string;
  role?: Role;
  birthDay?: string;

  iconUrl: string;
}

export { Role, User };
