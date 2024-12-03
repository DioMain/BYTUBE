import { useCallback, useState } from "react";

function useTrigger() {
  const [handler, setHandler] = useState(false);

  const trigger = useCallback(() => {
    setHandler(!handler);
  }, [handler, setHandler]);

  return { handler, trigger };
}

export default useTrigger;
