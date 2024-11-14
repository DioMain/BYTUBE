import { useCallback, useEffect, useState } from "react";
import VideoModel from "@type/models/VideoModel";
import axios, { AxiosError, AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import { useStores } from "appStoreContext";
import { Stack, Grid, Grid2 } from "@mui/material";
import VideoItem from "./VideoItem";
import UploadIcon from "@mui/icons-material/UploadFile";

import "./style.scss";
import { VSEProps } from "../types";

const VideosList: React.FC<VSEProps> = ({ setPage }) => {
  const [videos, setVideos] = useState<VideoModel[]>([]);

  const { channel, video } = useStores();

  const videoItemClickHandler = (videoModel: VideoModel) => {
    axios
      .get(QueriesUrls.VIDEO_COMMON, {
        params: {
          id: videoModel.id,
        },
      })
      .then((res: AxiosResponse) => {
        video.setVideo(res.data);
        setPage(2);
      });
  };

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
    <Stack className="studio-videolist" spacing={3}>
      <div className="studio-videolist__upload" onClick={() => setPage(1)}>
        <h3>Загрузить видео</h3>
        <UploadIcon />
      </div>
      <Stack className="studio-videolist__list">
        <Grid2 container spacing={2}>
          {videos.map((video, index) => {
            return (
              <Grid2 key={`vl_${index}`} size={6}>
                <VideoItem video={video} onClick={() => videoItemClickHandler(video)} />
              </Grid2>
            );
          })}
        </Grid2>
      </Stack>
      <Stack direction={"row"} className="studio-videolist-videos" spacing={2} flexWrap={"wrap"}></Stack>
    </Stack>
  );
};

export default VideosList;
