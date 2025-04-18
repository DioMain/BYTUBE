import { useCallback, useState } from "react";

function useTrigger() {
  const [handler, setHandler] = useState(false);

  const trigger = useCallback(() => {
    if (handler) setHandler(false);
    else setHandler(true);
  }, [handler, setHandler]);

  return { handler, trigger };
}

export default useTrigger;
