import getCreatedTimeText from "@helpers/GetCreatedTimeText";
import { Stack, Button, IconButton, Tooltip } from "@mui/material";
import AuthState from "@type/AuthState";
import CommentModel from "@type/models/CommentModel";
import { Role } from "@type/models/UserModel";
import { useStores } from "appStoreContext";
import { useEffect, useRef, useState } from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";

interface CommentItemProps {
  comment: CommentModel;
  onUpdate: (text: string, id: number) => void;
  onDelete: (id: number) => void;
  onLike: (id: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onLike, onDelete, onUpdate }) => {
  const updateField = useRef<HTMLInputElement>(null);

  const { user } = useStores();

  const [updateMode, setUpdateMode] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState(comment.message);
  const [likeIt, setLikeIt] = useState(comment.userIsLikeIt);
  const [beLiked, setBeLiked] = useState(comment.userIsLikeIt);

  useEffect(() => {
    if (user.status === AuthState.Authed) {
      if (user.value?.id === comment.userId || user.value?.role === Role.Admin) setIsOwner(true);
    }
  }, []);

  const handleChoiceEditMode = () => {
    setUpdateMode(!updateMode);
  };

  const handleSubmitUpdate = () => {
    onUpdate(updateField.current!.value, comment.id!);
    setMessage(updateField.current!.value);
    setUpdateMode(false);
  };

  const handleLike = () => {
    onLike(comment.id!);
    setLikeIt(!likeIt);
  };

  return (
    <Stack className="commentviewer-list-item" direction={"row"} spacing={2}>
      <div
        className="commentviewer-list-item__icon"
        style={{ backgroundImage: `url("${comment.user?.iconUrl}")`, width: "48px" }}
      ></div>

      <Stack spacing={1} style={{ width: "90%" }}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack className="commentviewer-list-item__name">{comment.user?.name}</Stack>
          <div className="commentviewer-list-item__created">{getCreatedTimeText(comment.created!)}</div>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} spacing={2}>
          {updateMode ? (
            <>
              <input
                type="text"
                className="commentviewer-list-item__input"
                ref={updateField}
                defaultValue={comment.message}
              />
              <Button variant="contained" color="primary" onClick={handleSubmitUpdate}>
                Подтвердить
              </Button>
            </>
          ) : (
            <p className="commentviewer-list-item__text">{message}</p>
          )}
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <IconButton size="small" onClick={handleLike} disabled={user.status !== AuthState.Authed}>
            {likeIt ? <ThumbUpAltIcon color="primary" /> : <ThumbUpOffAltIcon />}
          </IconButton>
          <Stack justifyContent={"center"}>
            {comment.likesCount! + (beLiked ? (likeIt ? 0 : -1) : likeIt ? 1 : 0)}
          </Stack>
          {isOwner && (
            <>
              <IconButton size="small" onClick={handleChoiceEditMode}>
                <EditIcon color={updateMode ? "primary" : "action"} />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(comment.id!)}>
                <DeleteIcon color="error" />
              </IconButton>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CommentItem;
