import PlaylistModel from "@type/models/PlaylistModel";
import PropsBase from "@type/PropsBase";

interface HeaderDrawerProps extends PropsBase {
  isOpened: boolean;
  closeCallback?: () => void;
  onClickChannelCreation?: () => void;
  onClickPlaylistCreation?: () => void;
  onClickPlaylistOpenView?: (playlist: PlaylistModel) => void;
}

export { HeaderDrawerProps };
