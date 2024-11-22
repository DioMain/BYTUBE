import { Stack } from "@mui/material";
import PlaylistModel from "@type/models/PlaylistModel";

import "./style.scss";

interface PVProps {
  playlist: PlaylistModel | null;
}

const PlaylistViewer: React.FC<PVProps> = ({ playlist }) => {
  if (playlist === null) return <></>;

  return <Stack>HAS PLAYLIST: {playlist.name}</Stack>;
};

export default PlaylistViewer;
