export type Post = {
  id?: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: unknown;
  likes?: number;
};
