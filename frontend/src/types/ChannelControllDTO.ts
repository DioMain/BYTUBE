import ChannelModel from "./models/ChannelModel";
import { User } from "./models/UserModel";

interface ChannelControllDTO {
  user: User;
  channel: ChannelModel;
}

export default ChannelControllDTO;
