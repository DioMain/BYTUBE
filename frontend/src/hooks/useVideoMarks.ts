import QueriesUrls from "@helpers/QeuriesUrls";
import StatusBase from "@type/StatusBase";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

interface VideoMarkModel {
  likesCount: number;
  dislikesCount: number;

  userIsLikeIt: boolean;
  userIsDislikeIt: boolean;
}

function useVideoMarks(id: number) {
  const [data, setData] = useState<VideoMarkModel | undefined>(undefined);
  const [state, setState] = useState(StatusBase.Loading);
  const [error, setError] = useState("");

  useEffect(() => {
    if (state !== StatusBase.Loading) return;

    axios
      .get(QueriesUrls.GET_VIDEO_MARKS, {
        params: {
          id: id,
        },
      })
      .then((res: AxiosResponse) => {
        setData(res.data);
        setState(StatusBase.Success);
      })
      .catch((err: AxiosError) => {
        setError(err.message);
        setState(StatusBase.Failed);
      });
  }, [state]);

  return { data, state, setState, error };
}

export default useVideoMarks;
