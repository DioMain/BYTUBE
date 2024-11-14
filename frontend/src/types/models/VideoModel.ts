import ChannelModel from "./ChannelModel";

enum Access {
  All,
  LinkOnly,
  Private,
}

enum Status {
  NoLimit,
  Limited,
  Blocked,
}

interface VideoModel {
  id: number;
  title: string;
  description?: string;
  created: string;
  duration: string;

  videoAccess: Access;
  videoStatus: Status;

  views: number;

  tags?: string[];

  previewUrl: string;
  videoUrl?: string;

  channel?: ChannelModel;
}

export default VideoModel;

export { Status, Access };
