import ChannelModel from "./models/ChannelModel";
import { User } from "./models/UserModel";

interface AdminControllDTO {
  user: User;
  channel: ChannelModel;
}

export default AdminControllDTO;
