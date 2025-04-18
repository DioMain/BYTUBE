import { Stack } from "@mui/material";
import { Avatar } from "@styles/Mixins";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const ChannelItem = styled(Stack)`
  background-color: ${ThemeValues.commonBackColor};
  padding: ${ThemeValues.commonPadding};

  border-radius: ${ThemeValues.commonBorderRadius};

  &:hover {
    background-color: ${ThemeValues.hoveredBackColor};
    cursor: pointer;
  }
`;

const Icon = styled(Stack)`
  ${Avatar("96px")}
`;

export default {
  Icon,

  ChannelItem,
};
