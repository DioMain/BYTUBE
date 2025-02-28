import VideoModel from "./VideoModel";

interface PlaylistItemModel {
  playlistId: string;
  videoId: string;
  order: number;
}

enum PlaylistAccess {
  Public,
  Private,
}

interface PlaylistModel {
  id: string;
  name: string;

  access: PlaylistAccess;

  userId: string;

  playlistItems: PlaylistItemModel[];

  videos?: VideoModel[];
}

export { PlaylistItemModel, PlaylistAccess };

export default PlaylistModel;
