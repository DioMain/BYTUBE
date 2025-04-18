import { Stack } from "@mui/material";
import styled from "styled-components";

const ChannelOverview = styled(Stack)`
  padding-left: 48px;
  padding-right: 48px;

  margin-top: 32px;
`;

const VideoStatusGreen = styled.div`
  border-radius: 8px;

  background-color: gainsboro;

  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;

  width: 168px;
  height: 16px;
`;

const VideoStatusYellow = styled.div`
  border-left: 1px solid gray;
  border-right: 1px solid gray;

  background-color: gainsboro;

  width: 168px;
  height: 16px;
`;

const VideoStatusRed = styled.div`
  border-radius: 8px;

  background-color: gainsboro;

  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;

  width: 168px;
  height: 16px;
`;

export default {
  ChannelOverview,

  VideoStatusGreen,
  VideoStatusYellow,
  VideoStatusRed,
};
