import QueriesUrls from "@helpers/QeuriesUrls";
import AuthState from "@type/AuthState";
import StatusBase from "@type/StatusBase";
import { useStores } from "appStoreContext";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

function useOwnChannel(id: number) {
  const { channel, user } = useStores();

  const [status, setStatus] = useState(StatusBase.Loading);

  useEffect(() => {
    if (user.status === AuthState.Authed) {
      axios
        .get(QueriesUrls.CHECK_CHENNEL_IS_OWN, {
          params: {
            id: id,
          },
        })
        .then((res: AxiosResponse) => {
          channel.setChannel(res.data);
          setStatus(StatusBase.Success);
        })
        .catch((err: AxiosError) => {
          setStatus(StatusBase.Failed);
        });
    }
  }, [user.value]);

  return { status };
}

export default useOwnChannel;
