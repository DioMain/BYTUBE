import userStore from "./UserStore";
import channelStore from "./ChannelStore";
import videoStore from "./VideoStore";
import SearchDataStore from "./SearchDataStore";

class StoreWrapper {
  user = userStore;
  video = videoStore;
  channel = channelStore;
  searchData = SearchDataStore;
}

export default StoreWrapper;
