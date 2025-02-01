export type User = {
  id: string;
  role: string;
  username: string;
};

export type UserView = User & {
  email: string;
};
