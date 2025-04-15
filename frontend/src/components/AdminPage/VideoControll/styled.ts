import { Stack, Tabs } from "@mui/material";
import { Avatar, BoldFont } from "@styles/Mixins";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const VideoControll = styled(Stack)`
  background-color: ${ThemeValues.pageBackColor};
  min-height: ${window.innerHeight}px;
`;

const VideoList = styled.div`
  padding-top: 16px;

  padding-left: 36px;
  padding-right: 36px;
`;

export default {
  VideoControll,
  VideoList,
};
