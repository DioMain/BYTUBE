import { Stack } from "@mui/material";
import styled from "styled-components";

const VideoElement = styled(Stack)`
  padding: 8px;

  border-radius: 8px;
  background-color: rgb(200, 200, 200);

  cursor: pointer;

  &:hover {
    background-color: rgb(180, 180, 180);
  }
`;

const VideoElementImage = styled(Stack)`
  background-position: center;
  background-size: cover;

  min-width: 160px;
  height: 90px;

  border-radius: 8px;
`;

const VideoElementImage_Duration = styled(Stack)`
  margin-bottom: 6px;
  margin-right: 6px;

  color: white;

  font-size: 12px;

  padding: 4px;

  border-radius: 8px;

  background-color: rgba(0, 0, 0, 0.35);
`;

const ChannelName = styled.div`
  color: #333;

  font-size: 12px;

  width: max-content;

  &:hover {
    color: #000;
    text-decoration: underline;
  }
`;

const VideoCreated = styled.div`
  font-size: 12px;
`;

const styles = {
  ChannelName,
  VideoElement,
  VideoCreated,
  VideoElementImage,
  VideoElementImage_Duration,
};

export default styles;
