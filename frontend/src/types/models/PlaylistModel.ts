interface PlalistItemModel {
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

  playlistItems: PlalistItemModel[];
}

export { PlalistItemModel, PlaylistAccess };

export default PlaylistModel;
