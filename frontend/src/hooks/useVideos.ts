import QueriesUrls from "@helpers/QeuriesUrls";
import SelectOptions from "@type/SelectOptions";
import StatusBase from "@type/StatusBase";
import VideoModel from "@type/models/VideoModel";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";

function useVideos(options: SelectOptions, onLoaded?: (data: VideoModel[]) => void) {
  const [data, setData] = useState<VideoModel[]>([]);
  const [status, setStatus] = useState(StatusBase.Loading);
  const [fail, setFail] = useState("");

  const refresh = useCallback(() => {
    if (status !== StatusBase.Loading) setStatus(StatusBase.Loading);
  }, [status, setStatus]);

  useEffect(() => {
    console.log(status);
    if (status === StatusBase.Loading) {
      axios
        .get(QueriesUrls.GET_VIDEOS, {
          params: {
            skip: options.skip,
            take: options.take,
            ignore: options.ignore?.join(","),
            searchPattern: options.searchPattern === "" ? undefined : options.searchPattern,
            orderBy: options.orderBy,
            subscribes: options.subscribes,
            favorite: options.favorite,
            asAdmin: options.asAdmin,
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

  return { data, status, fail, refresh };
}

export { SelectOptions };

export default useVideos;
