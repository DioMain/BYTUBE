import VideoModel from "./VideoModel";

interface PlaylistItemModel {
  playlistId: number;
  videoId: number;
}

enum PlaylistAccess {
  Public,
  Private,
}

interface PlaylistModel {
  id: number;
  name: string;

  access: PlaylistAccess;

  userId: number;

  playlistItems: PlaylistItemModel[];

  videos?: VideoModel[];
}

export { PlaylistItemModel, PlaylistAccess };

export default PlaylistModel;
