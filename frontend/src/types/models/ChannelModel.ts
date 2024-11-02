interface ChannelModel {
  id: number;
  name: string;
  description: string;
  created: string;

  subscribes: number;

  iconUrl: string;
  headerUrl: string;
}

export default ChannelModel;
