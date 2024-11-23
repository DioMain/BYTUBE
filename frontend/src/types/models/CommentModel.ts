interface CommentModel {
  id?: number;
  message: string;
  userId: number;
  videoId: number;
  likes?: number[];
  created?: string;
}

export default CommentModel;
