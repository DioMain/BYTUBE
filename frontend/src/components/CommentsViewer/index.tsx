import VideoModel from "@type/models/VideoModel";
import "./styles.scss";
import { Alert, Stack, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useStores } from "appStoreContext";
import axios, { AxiosError, AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import AuthState from "@type/AuthState";
import ServerError from "@type/ServerError";
import CommentItem from "./CommentItem";
import CommentModel from "@type/models/CommentModel";

interface CommentsViewerProps {
  video: VideoModel;
}

const CommentsViewer: React.FC<CommentsViewerProps> = ({ video }) => {
  const { user } = useStores();

  const [error, setError] = useState("");
  const [comments, setComments] = useState<CommentModel[]>([]);

  const inputMessageField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios
      .get(QueriesUrls.GET_VIDEO_COMMENTS, {
        params: {
          vid: video.id,
        },
      })
      .then((res: AxiosResponse) => {
        setComments(res.data);
      })
      .catch((err: AxiosError) => {
        let srvErr = new ServerError(err);

        setError(srvErr.getFirstError());
      });
  }, []);

  const handleCreateComment = () => {
    if (user.status !== AuthState.Authed) return;

    axios
      .post(QueriesUrls.COMMENT_COMMON, {
        Message: inputMessageField.current!.value,
        VideoId: video.id,
      })
      .then(() => {
        setComments([
          ...comments,
          {
            message: inputMessageField.current!.value,
            videoId: video.id,
            created: Date.now().toString(),
            userId: user.value!.id,
            likesCount: 0,
            userIsLikeIt: false,
            user: user.value!,
          },
        ]);
      })
      .catch((err: AxiosError) => {
        const srvError = new ServerError(err);

        setError(srvError.getFirstError());
      });
  };

  const handleUpdateComment = (text: string, id: number) => {
    if (user.status !== AuthState.Authed) return;

    axios
      .put(
        QueriesUrls.COMMENT_COMMON,
        {
          Message: text,
        },
        {
          params: {
            id: id,
          },
        }
      )
      .catch((err: AxiosError) => {
        setError(err.message);
      });
  };

  const handleDeleteComment = (id: number) => {
    if (user.status !== AuthState.Authed) return;

    axios
      .delete(QueriesUrls.COMMENT_COMMON, {
        params: {
          id: id,
        },
      })
      .then(() => {
        setComments(comments.filter((i) => i.id !== id));
      })
      .catch((err: AxiosError) => {
        setError(err.message);
      });
  };

  const handleLikeComment = (id: number) => {
    if (user.status !== AuthState.Authed) return;

    axios
      .post(QueriesUrls.COMMENT_LIKE, null, {
        params: {
          id: id,
        },
      })
      .catch((err: AxiosError) => {
        setError(err.message);
      });
  };

  return (
    <Stack className="commentviewer" spacing={2}>
      {user.status === AuthState.Authed ? (
        <Stack className="commentviewer-newcomment" direction={"row"} spacing={2}>
          <input type="text" ref={inputMessageField} />
          <Button variant="contained" color="primary" onClick={handleCreateComment}>
            Отправить
          </Button>
        </Stack>
      ) : (
        <Alert severity="info" variant="outlined">
          Что бы писать комментарии нужно быть авторизованным на сайте
        </Alert>
      )}
      <Stack className="commentviewer-list" spacing={1}>
        {comments.map((item, index) => {
          return (
            <CommentItem
              comment={item}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
              onLike={handleLikeComment}
            />
          );
        })}
      </Stack>
      {error !== "" && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
};

export default CommentsViewer;