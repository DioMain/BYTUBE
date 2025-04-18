enum ChannelStatus {
  Normal,
  Limited,
  Blocked,
}

interface ChannelModel {
  id: string;
  name: string;
  description?: string;
  created?: string;

  status: ChannelStatus;

  subscribes: number;

  isSubscripted: boolean;

  iconUrl: string;
  bannerUrl?: string;
}

export default ChannelModel;

export { ChannelStatus };
