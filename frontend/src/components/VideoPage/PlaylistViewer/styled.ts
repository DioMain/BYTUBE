import { Stack } from "@mui/material";
import styled from "styled-components";

const PlaylistView = styled(Stack)`
  box-shadow: 0 0 8px #888;

  background-color: #aaa;

  padding: 8px;

  border-radius: 2px;
`;

const PlaylistViewTitle = styled.div`
  font-size: 18px;
  font-weight: 500;

  text-align: center;
`;

const styles = {
  PlaylistView,
  PlaylistViewTitle,
};

export default styles;
