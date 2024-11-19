import { Stack } from "@mui/material";

interface PVProps {
  playlistId: number;
}

const PlaylistViewer: React.FC<PVProps> = ({ playlistId }) => {
  return <Stack>HAS PLAYLIST: {playlistId}</Stack>;
};

export default PlaylistViewer;
