import { User } from "./UserModel";

interface CommentModel {
  id?: string;
  message: string;
  userId: string;
  videoId: string;
  likesCount?: number;
  userIsLikeIt?: boolean;
  isVideoOwner?: boolean;
  created?: string;

  user?: User;
}

export default CommentModel;
