import userStore from "./UserStore";
import channelStore from "./ChannelStore";
import videoStore from "./VideoStore";

class StoreWrapper {
  user = userStore;
  video = videoStore;
  channel = channelStore;
}

export default StoreWrapper;
