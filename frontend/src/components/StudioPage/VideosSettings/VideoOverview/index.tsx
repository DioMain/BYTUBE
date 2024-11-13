import { useCallback, useEffect, useState } from "react";
import VideoModel from "@type/models/VideoModel";
import axios, { AxiosError, AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import { useStores } from "appStoreContext";
import { Stack } from "@mui/material";
import VideoItem from "./VideoItem";
import UploadIcon from "@mui/icons-material/UploadFile";

import "./style.scss";
import { VSEProps } from "../types";

const VideosOverview: React.FC<VSEProps> = ({ setPage }) => {
  const [videos, setVideos] = useState<VideoModel[]>([]);

  const { channel } = useStores();

  useEffect(() => {
    axios
      .get(QueriesUrls.GET_CHANNEL_VIDEOS, {
        params: {
          channelId: channel.value?.id,
        },
      })
      .then((res: AxiosResponse) => {
        setVideos(res.data);
      })
      .catch((err: AxiosError) => {
        console.log(err.message);
      });
  }, [channel.value]);

  return (
    <Stack className="studio-videooverview" spacing={3}>
      <div className="studio-videooverview__upload" onClick={() => setPage(1)}>
        <h3>Загрузить видео</h3>
        <UploadIcon />
      </div>
      <Stack className="studio-videooverview-videos" spacing={2}>
        {videos.map((video, index) => {
          return <VideoItem video={video} key={`vi${index}`} />;
        })}
      </Stack>
    </Stack>
  );
};

export default VideosOverview;
