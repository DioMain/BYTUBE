import { Stack } from "@mui/material";
import { Avatar } from "@styles/Mixins";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const SearchPageVideoItem = styled(Stack)`
  padding: ${ThemeValues.commonPadding};
  background-color: ${ThemeValues.commonBackColor};
  border-radius: ${ThemeValues.commonBorderRadius};

  &:hover {
    background-color: ${ThemeValues.hoveredBackColor};
    box-shadow: 0 0 4px ${ThemeValues.hoveredBackColor};
    cursor: pointer;
  }
`;

const ItemTitle = styled.h2``;

const ItemDescription = styled.p`
  font-size: 12px;

  text-overflow: ellipsis;
  overflow: hidden;

  height: 48px;
`;

const ItemChannel = styled(Stack)``;

const ItemChannelIcon = styled.div`
  ${Avatar("32px")}
`;

const ItemChannelLink = styled.a`
  font-size: 16px;
  color: #444;
  text-decoration: none;
  width: max-content;

  &:hover {
    text-decoration: underline;
  }
`;

export default {
  SearchPageVideoItem,

  ItemTitle,
  ItemDescription,

  ItemChannel,
  ItemChannelIcon,
  ItemChannelLink,
};
