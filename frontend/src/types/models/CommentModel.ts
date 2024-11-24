import { User } from "./UserModel";

interface CommentModel {
  id?: number;
  message: string;
  userId: number;
  videoId: number;
  likesCount?: number;
  userIsLikeIt?: boolean;
  created?: string;

  user?: User;
}

export default CommentModel;
