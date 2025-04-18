import { Stack } from "@mui/material";
import styled from "styled-components";

const PlaylistModalItem = styled(Stack)`
  padding: 8px;

  border-radius: 12px;

  background-color: white;

  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
`;

const ItemImage = styled(Stack)`
  background-position: center;
  background-size: cover;

  border-radius: 12px;

  width: 124px;
  height: 70px;

  padding: 4px;
`;

const ItemImageDuration = styled.div`
  padding: 4px;
  border-radius: 8px;
  font-size: 12px;

  background-color: rgba(0, 0, 0, 0.35);

  color: white;
`;

const ItemChannelName = styled.div`
  font-size: 12px;

  color: rgb(51, 51, 51);
`;

export default {
  PlaylistModalItem,
  ItemImage,
  ItemImageDuration,
  ItemChannelName,
};
