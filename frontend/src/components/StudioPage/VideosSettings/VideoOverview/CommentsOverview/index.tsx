import CommentsViewer from "@components/CommentsViewer";
import { Stack } from "@mui/material";
import { useStores } from "appStoreContext";

const CommentsOverview: React.FC = () => {
  const { video } = useStores();

  return (
    <Stack
      style={{
        paddingLeft: "128px",
        paddingRight: "128px",
      }}
    >
      <CommentsViewer video={video.value!} />
    </Stack>
  );
};

export default CommentsOverview;
