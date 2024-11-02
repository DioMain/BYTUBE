import QueriesUrls from "@helpers/QeuriesUrls";
import AuthState from "@type/AuthState";
import { useStores } from "appStoreContext";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect } from "react";

function useAuth() {
  const { user } = useStores();

  useEffect(() => {
    axios
      .get(QueriesUrls.AUTH)
      .then((res: AxiosResponse) => {
        user.setStatus(AuthState.Authed);
        user.setUser(res.data);
      })
      .catch((err: AxiosError) => {
        if (err.code === "401") {
          user.setStatus(AuthState.NotAuthed);
        } else {
          user.setStatus(AuthState.Failed);
          user.setError(err.cause?.message!);
        }
      });
  }, []);

  return { user };
}

export default useAuth;
