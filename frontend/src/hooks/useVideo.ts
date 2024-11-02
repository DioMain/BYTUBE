import StatusBase from "@type/StatusBase";
import VideoModel from "@type/VideoModel";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

function useVideo(id: number) {
  const [data, setData] = useState<VideoModel | undefined>(undefined);
  const [status, setStatus] = useState(StatusBase.Loading);
  const [fail, setFail] = useState("");

  useEffect(() => {
    axios
      .get("/api/video", {
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
