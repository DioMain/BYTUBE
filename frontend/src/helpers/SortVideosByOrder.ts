import { PlaylistItemModel } from "@type/models/PlaylistModel";
import VideoModel from "@type/models/VideoModel";

function SortVideosByOrder(playlistItems: PlaylistItemModel[], videos: VideoModel[]): VideoModel[] {
  const totalMap = videos.map((video) => {
    const order = playlistItems.find((item) => item.videoId === video.id)!.order as number;

    return {
      video,
      order,
    };
  });

  totalMap.sort((a, b) => {
    if (a.order < b.order) return -1;
    else if (a.order > b.order) return 1;

    return 0;
  });
  return totalMap.map((item) => item.video);
}

export default SortVideosByOrder;
