import { Stack } from "@mui/material";
import styles from "./styled";
import PropsBase from "@type/PropsBase";

interface ImageWithDurationProps extends PropsBase {
  aspect?: number;

  baseWidth?: number;
  baseHeight?: number;

  previewUrl: string;
  duration: string;

  onClick?: () => void;
}

const ImageWithDuration: React.FC<ImageWithDurationProps> = ({
  previewUrl,
  duration,
  aspect,
  baseHeight,
  baseWidth,
  className,
  onClick,
}) => {
  aspect = aspect ?? 1;
  baseHeight = baseHeight ?? 135;
  baseWidth = baseWidth ?? 240;

  return (
    <styles.ImageWithDuration_Image
      justifyContent={"end"}
      style={{
        backgroundImage: `url("${previewUrl}")`,
        minHeight: `${baseHeight * aspect}px`,
        minWidth: `${baseWidth * aspect}px`,
      }}
      onClick={onClick}
      className={className}
    >
      <Stack direction={"row"} justifyContent={"end"}>
        <styles.ImageWithDuration_Duration>{duration}</styles.ImageWithDuration_Duration>
      </Stack>
    </styles.ImageWithDuration_Image>
  );
};

export default ImageWithDuration;
