import { Stack } from "@mui/material";
import { Avatar } from "@styles/Mixins";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const ChannelView = styled(Stack)`
  background-color: ${ThemeValues.commonBackColor};

  padding: ${ThemeValues.commonPadding};
  border-radius: ${ThemeValues.commonBorderRadius};
`;

const ChannelBanner = styled.div`
  height: 128px;

  border-radius: ${ThemeValues.smallBorderRadius};
  padding: ${ThemeValues.smallPadding};

  background-position: center;
  background-size: cover;
`;

const ChannelBanner_Title = styled.div`
  padding: ${ThemeValues.tinyPadding};

  border-radius: ${ThemeValues.smallBorderRadius};

  background-color: rgba(0, 0, 0, 0.25);
  color: #fff;

  width: max-content;
`;

const UserView = styled(Stack)`
  background-color: #ccc;

  padding: ${ThemeValues.commonPadding};
  border-radius: ${ThemeValues.smallBorderRadius};
`;

const UserIcon = styled(Stack)`
  ${Avatar("64px")}
`;

export default {
  ChannelView,
  ChannelBanner,
  ChannelBanner_Title,

  UserView,
  UserIcon,
};
