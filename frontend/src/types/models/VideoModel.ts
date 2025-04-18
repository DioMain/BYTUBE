import ChannelModel from "./ChannelModel";

enum Access {
  All = 0,
  LinkOnly,
  Private,
}

enum Status {
  NoLimit = 0,
  Limited,
  Blocked,
}

interface VideoModel {
  id: string;
  title: string;
  description: string;
  created: string;
  duration: string;

  forAdults: boolean;

  videoAccess: Access;
  videoStatus: Status;

  views: number;
  reportsCount?: number;

  tags?: string[];

  previewUrl: string;
  videoUrl?: string;

  channel?: ChannelModel;
}

export default VideoModel;

export { Status, Access };
