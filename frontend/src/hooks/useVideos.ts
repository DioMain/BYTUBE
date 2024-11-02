import QueriesUrls from "@helpers/QeuriesUrls";
import StatusBase from "@type/StatusBase";
import VideoModel from "@type/models/VideoModel";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

function useVideos(skip: number, take: number) {
  const [data, setData] = useState<VideoModel[]>([]);
  const [status, setStatus] = useState(StatusBase.Loading);
  const [fail, setFail] = useState("");

  useEffect(() => {
    axios
      .get(QueriesUrls.GET_VIDEOS, {
        params: {
          skip: skip,
          take: take,
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
  }, [skip, take]);

  return { data, status, fail };
}

export default useVideos;
