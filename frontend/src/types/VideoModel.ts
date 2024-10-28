import ChannelModel from "./ChannelModel";

interface VideoModel {
  id: number;
  title: string;
  description: string;
  created: string;
  duration: string;
  views: number;
  tags: string[];
  channel: ChannelModel;
}

export default VideoModel;
