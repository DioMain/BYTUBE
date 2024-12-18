import { CopyAll } from "@mui/icons-material";
import { Stack, IconButton, Tooltip } from "@mui/material";
import { useStores } from "appStoreContext";

const VideoStats: React.FC = () => {
  const { video } = useStores();

  return (
    <Stack style={{ marginLeft: "32px", marginRight: "32px" }} spacing={2}>
      <Stack>
        <h3>Ссылка на видео</h3>
        <Stack direction={"row"} spacing={1}>
          <Stack direction={"row"} style={{ padding: "6px", backgroundColor: "#222222", borderRadius: "12px" }}>
            {window.location.origin}/App/Video?id={video.value?.id}
          </Stack>
          <Tooltip title="Копировать в буфер обмена">
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/App/Video?id=${video.value?.id}`);
              }}
            >
              <CopyAll />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack>Просмотров: {video.value?.views}</Stack>
    </Stack>
  );
};

export default VideoStats;
