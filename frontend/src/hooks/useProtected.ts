import QueriesUrls from "@helpers/QeuriesUrls";
import AuthState from "@type/AuthState";
import { useStores } from "appStoreContext";
import { useEffect } from "react";

function useProtected() {
  const { user } = useStores();

  useEffect(() => {
    if (user.status === AuthState.Failed || user.status === AuthState.NotAuthed) {
      window.location.assign(QueriesUrls.MAIN_PAGE);
    }
  }, [user.status]);
}

export default useProtected;
