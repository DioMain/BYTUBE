import StatusBase from "@type/StatusBase";
import useOnSeeElement from "./useOnScrollEnd";
import useVideos, { SelectOptions } from "./useVideos";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import VideoModel from "@type/models/VideoModel";

function useVideosWithPagination(observeDivElement: RefObject<HTMLDivElement | null>, initOptions: SelectOptions) {
  const selectOptions = useRef<SelectOptions>(initOptions);
  const isWaitResponce = useRef(false);

  const [data, setData] = useState<VideoModel[]>([]);
  const [ended, setEnded] = useState<boolean>(false);

  const selectResult = useVideos(selectOptions.current, (ndata) => {
    setData([...data, ...ndata]);
    setEnded(ndata.length === 0);
    isWaitResponce.current = false;
  });

  useOnSeeElement(observeDivElement.current, () => {
    if (selectResult.status === StatusBase.Success && !ended && !isWaitResponce.current) {
      selectOptions.current.skip += selectOptions.current.take;
      selectOptions.current.take += selectOptions.current.take;

      isWaitResponce.current = true;

      selectResult.refresh();
    }
  });

  const refresh = useCallback(() => {
    if (selectResult.status !== StatusBase.Success) return;

    setData([]);
    setEnded(false);

    isWaitResponce.current = false;
    selectOptions.current = initOptions;

    selectResult.refresh();
  }, [initOptions, selectOptions.current]);

  const status = selectResult.status;

  return { data, ended, status, refresh };
}

export default useVideosWithPagination;
