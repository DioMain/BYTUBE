import { Stack } from "@mui/material";
import { Avatar } from "@styles/Mixins";
import styled from "styled-components";

const ChannelView = styled(Stack)`
  padding: 8px;

  background-color: #ccc;

  box-shadow: 0 0 8px #aaa;

  border-radius: 12px;

  cursor: pointer;

  &:hover {
    background-color: #bfbfbf;

    .info h4 {
      text-decoration: underline;
    }
  }
`;

const ChannelViewInfo = styled(Stack)`
  div {
    font-size: 12px;
  }
`;

const ChannelViewImage = styled(Stack)`
  ${Avatar("48px")}
`;

const styles = {
  ChannelView,
  ChannelViewInfo,
  ChannelViewImage,
};

export default styles;
