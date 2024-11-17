import { colors, IconButton, Stack } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useEffect, useRef } from "react";

import "./style.scss";
import useVideoMarks from "@hooks/useVideoMarks";
import axios from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import { useStores } from "appStoreContext";
import StatusBase from "@type/StatusBase";

const MarkVideo: React.FC<{ id: number }> = ({ id }) => {
  const greenLine = useRef<HTMLDivElement>(null);
  const redLine = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  const { user } = useStores();

  const { data, setState } = useVideoMarks(id);

  useEffect(() => {
    if (bar.current === null || data === undefined) return;

    const greenLineAspect = data.likesCount / (data.likesCount + data.dislikesCount);
    const redLineAspect = 1 - greenLineAspect;
    const totalWidth = bar.current.clientWidth;

    greenLine.current!.style.width = `${totalWidth * greenLineAspect}px`;
    redLine.current!.style.width = `${totalWidth * redLineAspect}px`;
  }, [bar, data]);

  const likeHandle = () => {
    axios
      .post(QueriesUrls.VIDEO_LIKE, null, {
        params: {
          id: id,
        },
      })
      .then(() => setState(StatusBase.Loading));
  };

  const dislikeHandle = () => {
    axios
      .post(QueriesUrls.VIDEO_DISLIKE, null, {
        params: {
          id: id,
        },
      })
      .then(() => setState(StatusBase.Loading));
  };

  return (
    <Stack justifyContent={"center"} spacing={1} className="markvideo">
      <Stack direction={"row"} spacing={2}>
        <IconButton
          disabled={user.value === undefined}
          onClick={likeHandle}
          color={data?.userIsLikeIt ? "primary" : "default"}
        >
          <ThumbUpIcon />
        </IconButton>
        <Stack justifyContent={"center"}>{data?.likesCount}</Stack>
        <IconButton
          disabled={user.value === undefined}
          onClick={dislikeHandle}
          color={data?.userIsDislikeIt ? "primary" : "default"}
        >
          <ThumbDownIcon />
        </IconButton>
        <Stack justifyContent={"center"}>{data?.dislikesCount}</Stack>
      </Stack>
      <Stack direction={"row"} className="markvideo-bar" ref={bar}>
        <div className="markvideo-bar__green" ref={greenLine} />
        <div className="markvideo-bar__red" ref={redLine} />
      </Stack>
    </Stack>
  );
};

export default MarkVideo;
