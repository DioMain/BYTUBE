import QueriesUrls from "@helpers/QeuriesUrls";
import StatusBase from "@type/StatusBase";
import VideoModel from "@type/models/VideoModel";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

function useVideo(id: number) {
  const [data, setData] = useState<VideoModel | undefined>(undefined);
  const [status, setStatus] = useState(StatusBase.Loading);
  const [fail, setFail] = useState("");

  useEffect(() => {
    axios
      .get(QueriesUrls.GET_VIDEO, {
        params: {
          id: id,
        },
      })
      .then((responce: AxiosResponse) => {
        setData(responce.data);
        setStatus(StatusBase.Success);
      })
      .catch((error: AxiosError) => {
        console.error(error.message);
        setFail(error.message);
        setStatus(StatusBase.Failed);
      });
  }, [id]);

  return { data, status, fail };
}

export default useVideo;
