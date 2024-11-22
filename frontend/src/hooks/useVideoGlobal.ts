import QueriesUrls from "@helpers/QeuriesUrls";
import StatusBase from "@type/StatusBase";
import { useStores } from "appStoreContext";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

function useVideoGlobal(id: number) {
  const [status, setStatus] = useState(StatusBase.Loading);
  const [fail, setFail] = useState("");

  const { video } = useStores();

  useEffect(() => {
    axios
      .get(QueriesUrls.VIDEO_COMMON, {
        params: {
          id: id,
        },
      })
      .then((responce: AxiosResponse) => {
        video.setVideo(responce.data);
        setStatus(StatusBase.Success);
      })
      .catch((error: AxiosError) => {
        console.error(error.message);
        setFail(error.message);
        setStatus(StatusBase.Failed);
      });
  }, [id]);

  return { status, fail };
}

export default useVideoGlobal;
