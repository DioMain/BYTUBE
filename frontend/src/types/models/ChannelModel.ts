interface ChannelModel {
  id: number;
  name: string;
  description?: string;
  created?: string;

  subscribes: number;

  isSubscripted: boolean;

  iconUrl: string;
  bannerUrl?: string;
}

export default ChannelModel;
