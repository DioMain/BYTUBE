import VideoModel from "@type/models/VideoModel";
import { makeAutoObservable } from "mobx";

class VideoStore {
  value?: VideoModel;

  constructor() {
    makeAutoObservable(this);
  }

  setVideo = (value?: VideoModel) => {
    this.value = value;
  };
}

export default new VideoStore();
