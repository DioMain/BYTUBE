import { Stack } from "@mui/material";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const ChannelViewItem = styled(Stack)`
  padding: ${ThemeValues.smallPadding};
  border-radius: ${ThemeValues.smallBorderRadius};

  background-color: ${ThemeValues.commonBackColor};

  &:hover {
    cursor: pointer;
    background-color: ${ThemeValues.hoveredBackColor};
  }
`;

export default {
  ChannelViewItem,
};
