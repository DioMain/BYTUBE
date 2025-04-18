import { Stack } from "@mui/material";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const VideoListItem = styled(Stack)`
  padding: ${ThemeValues.commonPadding};

  border-radius: ${ThemeValues.commonBorderRadius};

  background-color: ${ThemeValues.commonBackColor};

  cursor: pointer;

  &:hover {
    background-color: ${ThemeValues.hoveredBackColor};
    box-shadow: 0 0 4px ${ThemeValues.hoveredBackColor};
  }
`;

const ItemTitle = styled.h2``;

const ItemDescription = styled.p`
  font-size: 14px;

  text-overflow: ellipsis;

  height: 64px;
`;

export default {
  VideoListItem,

  ItemTitle,
  ItemDescription,
};
