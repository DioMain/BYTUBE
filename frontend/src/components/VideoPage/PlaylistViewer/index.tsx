import { Stack } from "@mui/material";
import PlaylistModel from "@type/models/PlaylistModel";

import "./style.scss";
import { useEffect, useState } from "react";
import VideoModel from "@type/models/VideoModel";
import axios, { AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import VideoItem from "./VideoItem";
import { useStores } from "appStoreContext";
import SortVideosByOrder from "@helpers/SortVideosByOrder";

interface PVProps {
  playlist: PlaylistModel | null;
}

const PlaylistViewer: React.FC<PVProps> = ({ playlist }) => {
  if (playlist === null) return <></>;

  const { video } = useStores();

  const [videos, setVideos] = useState<VideoModel[]>([]);

  useEffect(() => {
    axios
      .get(QueriesUrls.GET_PLAYLIST_VIDEOS, {
        params: {
          playlistId: playlist.id,
        },
      })
      .then((res: AxiosResponse) => {
        setVideos(SortVideosByOrder(playlist.playlistItems, res.data));
      });
  }, []);

  return (
    <Stack className="playlistview" spacing={2}>
      <div>
        плейлист: <span className="playlistview-title">{playlist.name}</span>
      </div>
      <Stack spacing={1}>
        {videos.map((item, index) => {
          return (
            <VideoItem
              key={`plv-vi-${index}`}
              video={item}
              onClick={() =>
                window.location.assign(`${QueriesUrls.VIDEO_PAGE}?id=${item.id}&playlistId=${playlist.id}`)
              }
              isCurrent={video.value?.id === item.id}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default PlaylistViewer;
