import getCreatedTimeText from "@helpers/GetCreatedTimeText";
import { Stack, Button, IconButton } from "@mui/material";
import AuthState from "@type/AuthState";
import CommentModel from "@type/models/CommentModel";
import { Role } from "@type/models/UserModel";
import { useStores } from "appStoreContext";
import { useEffect, useRef, useState } from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "../styled";

interface CommentItemProps {
  comment: CommentModel;
  onUpdate: (text: string, id: string) => void;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onLike, onDelete, onUpdate }) => {
  const updateField = useRef<HTMLInputElement>(null);

  const { user } = useStores();

  const [updateMode, setUpdateMode] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [message, setMessage] = useState(comment.message);
  const [likeIt, setLikeIt] = useState(comment.userIsLikeIt);
  const [beLiked, setBeLiked] = useState(comment.userIsLikeIt);

  useEffect(() => {
    if (user.status === AuthState.Authed) {
      if (user.value?.id === comment.userId) setIsOwner(true);
      if (user.value?.role === Role.Admin || comment.isVideoOwner) setCanDelete(true);
    }
  }, []);

  useEffect(() => {
    setMessage(comment.message);
    setLikeIt(comment.userIsLikeIt);
    setBeLiked(comment.userIsLikeIt);
  }, [comment]);

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
    <styles.ListItem direction={"row"} spacing={2}>
      <styles.ItemIcon style={{ backgroundImage: `url("${comment.user?.iconUrl}")` }}></styles.ItemIcon>

      <Stack spacing={1} style={{ width: "100%" }}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <styles.ItemName>{comment.user?.name}</styles.ItemName>
          <styles.ItemCreated>{getCreatedTimeText(comment.created!)}</styles.ItemCreated>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} spacing={2}>
          {updateMode ? (
            <>
              <styles.ItemInput type="text" ref={updateField} defaultValue={comment.message} />
              <Button variant="contained" color="primary" onClick={handleSubmitUpdate}>
                Подтвердить
              </Button>
            </>
          ) : (
            <styles.ItemText>{message}</styles.ItemText>
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
            </>
          )}

          {(canDelete || isOwner) && (
            <>
              <IconButton size="small" onClick={() => onDelete(comment.id!)}>
                <DeleteIcon color="error" />
              </IconButton>
            </>
          )}
        </Stack>
      </Stack>
    </styles.ListItem>
  );
};

export default CommentItem;
