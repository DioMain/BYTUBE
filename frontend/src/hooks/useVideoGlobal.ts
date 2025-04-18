import QueriesUrls from "@helpers/QeuriesUrls";
import ServerError from "@type/ServerError";
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
        if (error.code === "401") {
          setFail(error.message);
          setStatus(StatusBase.Failed);
        } else {
          let err = new ServerError(error.response?.data);

          setFail(err.getFirstError());
          setStatus(StatusBase.Failed);
        }
      });
  }, [id]);

  return { status, fail };
}

export default useVideoGlobal;
