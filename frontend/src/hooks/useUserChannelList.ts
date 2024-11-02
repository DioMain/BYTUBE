import QueriesUrls from "@helpers/QeuriesUrls";
import ChannelModel from "@type/models/ChannelModel";
import StatusBase from "@type/StatusBase";
import { useStores } from "appStoreContext";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

function useUserChannelList() {
  const { user } = useStores();

  const [data, setData] = useState<ChannelModel[] | undefined>(undefined);
  const [status, setStatus] = useState<StatusBase>(StatusBase.Loading);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setStatus(StatusBase.Loading);

    axios
      .get(QueriesUrls.GET_USER_CHANNELS_LIST)
      .then((res: AxiosResponse) => {
        setStatus(StatusBase.Success);
        setData(res.data);
      })
      .catch((err: AxiosError) => {
        setStatus(StatusBase.Failed);
        setError(err.message);
      });
  }, [user.value]);

  return { data, status, error };
}

export default useUserChannelList;
