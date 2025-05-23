import VideoModel from "@type/models/VideoModel";
import { Alert, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useStores } from "appStoreContext";
import axios, { AxiosError, AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import AuthState from "@type/AuthState";
import ServerError from "@type/ServerError";
import CommentItem from "./CommentItem";
import CommentModel from "@type/models/CommentModel";
import useTrigger from "@hooks/useTrigger";
import styles from "./styled";

interface CommentsViewerProps {
  video: VideoModel;
}

const CommentsViewer: React.FC<CommentsViewerProps> = ({ video }) => {
  const { user } = useStores();

  const [error, setError] = useState("");
  const [comments, setComments] = useState<CommentModel[]>([]);

  const refreshTrigger = useTrigger();

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
  }, [video, refreshTrigger.handler]);

  const handleCreateComment = () => {
    if (user.status !== AuthState.Authed) return;

    axios
      .post(QueriesUrls.COMMENT_COMMON, {
        Message: inputMessageField.current!.value,
        VideoId: video.id,
      })
      .then(() => {
        refreshTrigger.trigger();
      })
      .catch((err: AxiosError) => {
        const srvError = new ServerError(err);

        setError(srvError.getFirstError());
      });
  };

  const handleUpdateComment = (text: string, id: string) => {
    if (user.status !== AuthState.Authed) return;

    axios
      .put(
        QueriesUrls.COMMENT_COMMON,
        {
          Message: text,
          VideoId: video.id,
        },
        {
          params: {
            id: id,
          },
        }
      )
      .then(() => {
        let d = comments.map((value) => {
          let newValue = value;

          if (value.id === id) value.message = text;

          return newValue;
        });

        setComments(d);
      })
      .catch((err: AxiosError) => {
        setError(err.message);
      });
  };

  const handleDeleteComment = (id: string) => {
    if (user.status !== AuthState.Authed) return;

    let comIndex = comments.findIndex((c) => c.id === id);

    axios
      .delete(QueriesUrls.COMMENT_COMMON, {
        params: {
          id: id,
        },
      })
      .then(() => {
        let d = [...comments.slice(0, comIndex), ...comments.slice(comIndex + 1)];
        setComments(d);
      })
      .catch((err: AxiosError) => {
        setError(err.message);
      });
  };

  const handleLikeComment = (id: string) => {
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
    <styles.CommentViewer spacing={2}>
      {user.status === AuthState.Authed ? (
        <styles.NewComment direction={"row"} spacing={2}>
          <input type="text" ref={inputMessageField} />
          <Button variant="contained" color="primary" onClick={handleCreateComment}>
            Отправить
          </Button>
        </styles.NewComment>
      ) : (
        <Alert severity="info" variant="outlined">
          Что бы писать комментарии нужно быть авторизованным на сайте
        </Alert>
      )}
      <styles.CommentList spacing={1}>
        {comments.map((item, index) => {
          return (
            <CommentItem
              key={`comment-i-${index}`}
              comment={item}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
              onLike={handleLikeComment}
            />
          );
        })}
      </styles.CommentList>
      {error !== "" && <Alert severity="error">{error}</Alert>}
    </styles.CommentViewer>
  );
};

export default CommentsViewer;
