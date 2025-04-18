import { Stack } from "@mui/material";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const ImageWithDuration_Image = styled(Stack)`
  padding: ${ThemeValues.commonPadding};

  background-position: center;
  background-size: cover;

  max-width: max-content;
  max-height: max-content;

  border-radius: ${ThemeValues.commonBorderRadius};
`;

const ImageWithDuration_Duration = styled.div`
  padding: ${ThemeValues.tinyPadding};
  border-radius: ${ThemeValues.commonBorderRadius};

  background-color: rgba(0, 0, 0, 0.35);
  color: white;
`;

export default {
  ImageWithDuration_Image,
  ImageWithDuration_Duration,
};
