import { CopyAll } from "@mui/icons-material";
import { Stack, IconButton, Tooltip } from "@mui/material";
import { ThemeValues } from "@styles/Themes";
import { useStores } from "appStoreContext";
import styled from "styled-components";

const VideoLink = styled(Stack)`
  padding: ${ThemeValues.commonPadding};
  background-color: ${ThemeValues.commonBackColor};
  border-radius: ${ThemeValues.commonBorderRadius};
`;

const VideoStats: React.FC = () => {
  const { video } = useStores();

  return (
    <Stack style={{ marginLeft: "32px", marginRight: "32px" }} spacing={2}>
      <Stack>
        <h3>Ссылка на видео</h3>
        <Stack direction={"row"} spacing={1}>
          <VideoLink justifyContent={"center"}>
            {window.location.origin}/App/Video?id={video.value?.id}
          </VideoLink>
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
