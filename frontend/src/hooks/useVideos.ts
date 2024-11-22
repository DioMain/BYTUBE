import QueriesUrls from "@helpers/QeuriesUrls";
import StatusBase from "@type/StatusBase";
import VideoModel from "@type/models/VideoModel";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";

interface SelectOptions {
  ignore?: number[];
  namePattern?: string;

  take: number;
  skip: number;
}

function useVideos(options: SelectOptions, onLoaded?: (data: VideoModel[]) => void) {
  const [data, setData] = useState<VideoModel[]>([]);
  const [status, setStatus] = useState(StatusBase.Loading);
  const [fail, setFail] = useState("");

  const doRequest = useCallback(() => {
    if (status !== StatusBase.Loading) setStatus(StatusBase.Loading);
  }, [status, setStatus]);

  useEffect(() => {
    if (status === StatusBase.Loading) {
      axios
        .get(QueriesUrls.GET_VIDEOS, {
          params: {
            skip: options.skip,
            take: options.take,
            ignore: options.ignore?.join(","),
            namePattern: options.namePattern,
          },
        })
        .then((responce: AxiosResponse) => {
          setData(responce.data);
          setStatus(StatusBase.Success);

          if (onLoaded !== undefined) onLoaded(responce.data);
        })
        .catch((error: AxiosError) => {
          setFail(error.message);
          setStatus(StatusBase.Failed);
        });
    }
  }, [status]);

  return { data, status, fail, doRequest };
}

export { SelectOptions };

export default useVideos;
