import ChannelModel from "@type/models/ChannelModel";
import { makeAutoObservable } from "mobx";

class ChannelStore {
  value?: ChannelModel;

  constructor() {
    makeAutoObservable(this);
  }

  setChannel = (value?: ChannelModel) => {
    this.value = value;
  };
}

export default new ChannelStore();
