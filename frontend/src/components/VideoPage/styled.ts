import styled from "styled-components";
import { Stack, styled as styledM } from "@mui/material";
import { BoldFont } from "@styles/Mixins";

const VideoPage = styled.div`
  padding: 16px;

  display: flex;

  margin-left: 48px;
  margin-right: 48px;

  justify-content: space-between;
  gap: 16px;

  @media screen and (max-width: 1000px) {
    flex-direction: column;

    margin-left: 20px;
    margin-right: 20px;
  }
`;

const VideoPageMain = styled(Stack)`
  width: 60%;
  gap: 8px;

  @media screen and (max-width: 1000px) {
    width: 100%;
  }
`;

const OtherVideos = styled(Stack)`
  width: 35%;

  @media screen and (max-width: 1000px) {
    width: auto;
  }
`;

const VideoTitle = styled.h1`
  ${BoldFont("22px")}

  margin-top: 8px;
  margin-bottom: 8px;
`;

const VideoTag = styled.div`
  background-color: rgb(212, 212, 212);
  color: black;

  border-radius: 8px;

  padding: 4px;

  &:hover {
    cursor: pointer;
    background-color: rgb(170, 170, 170);
  }
`;

const VideoDescription = styled(Stack)`
  background-color: rgb(196, 196, 196);

  padding: 6px;

  border-radius: 4px;
`;

const styles = {
  VideoPage,
  VideoPageMain,
  VideoDescription,
  VideoTag,
  VideoTitle,
  OtherVideos,
};

export default styles;
