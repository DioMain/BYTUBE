import useVideo from "@hooks/useVideo";
import VideoPlayer from "@components/VideoPlayer";
import "./style.scss";
import StatusBase from "@type/StatusBase";
import { LinearProgress } from "@mui/material";
import VideoElement from "./VideoElement";
import useVideos from "@hooks/useVideos";
import { useState } from "react";

const VideoPage: React.FC = () => {
  const vid = parseInt(URL.parse(window.location.href)?.searchParams.get("vid")!);

  const { data, status, fail } = useVideo(vid);
  const otherVideos = useVideos(0, 10);

  switch (status) {
    case StatusBase.Loading:
      return <LinearProgress />;
    case StatusBase.Failed:
      return <div>{fail}</div>;
    default:
      return (
        <div className="videopage">
          <div className="videopage-main">
            <VideoPlayer url={`/videos/${vid}/video.mp4`} className="videopage__player" width={`auto`} />

            <div className="videpage-vtitle">{data?.title}</div>
            <div className="videopage-control"></div>
            <div className="videopage-description"></div>
            <div className="videopage-comments">{data?.description}</div>
          </div>
          <div className="videopage-othervideos">
            {otherVideos.status === StatusBase.Success &&
              otherVideos.data.map((item, index) => {
                if (item.id === vid) return null;

                return <VideoElement video={item} key={`othervideo${index}`} />;
              })}
          </div>
        </div>
      );
  }
};

export default VideoPage;
