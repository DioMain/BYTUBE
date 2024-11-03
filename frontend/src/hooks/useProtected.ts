import AuthState from "@type/AuthState";
import { useStores } from "appStoreContext";
import { useEffect } from "react";

function useProtected() {
  const { user } = useStores();

  useEffect(() => {
    if (user.status === AuthState.Failed || user.status === AuthState.NotAuthed) {
      window.location.assign("/App/Main");
    }
  }, [user.status]);
}

export default useProtected;
