import ChannelModel from "./ChannelModel";

interface VideoModel {
  id: number;
  title: string;
  description?: string;
  created: string;
  duration: string;

  views: number;

  tags?: string[];

  previewUrl: string;
  videoUrl?: string;

  channel?: ChannelModel;
}

export default VideoModel;
