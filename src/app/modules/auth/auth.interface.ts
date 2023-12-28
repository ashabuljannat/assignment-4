export type TRegUser = {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
};

export type TLoginUser = {
  username: string;
  password: string;
};
