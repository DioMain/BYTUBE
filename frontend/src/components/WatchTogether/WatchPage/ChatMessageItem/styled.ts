import { Stack } from "@mui/material";
import { Avatar } from "@styles/Mixins";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const ChatItem = styled(Stack)`
  padding: ${ThemeValues.smallPadding};

  border-radius: ${ThemeValues.tinyBorderRadius};

  background-color: #cbcbcb;
`;

const ChatItemIcon = styled(Stack)`
  ${Avatar("36px")}

  min-width: 36px;
`;

const ChatItemContent = styled(Stack)`
  width: 100%;
  font-size: 12px;
`;

export default {
  ChatItem,
  ChatItemIcon,
  ChatItemContent,
};
