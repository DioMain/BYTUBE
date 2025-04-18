import { Stack, Tabs } from "@mui/material";
import { Avatar, BoldFont } from "@styles/Mixins";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const Header = styled(Stack)`
  padding: 8px;

  background-color: ${ThemeValues.whiteBackColor};

  padding-left: 36px;
  padding-right: 36px;
`;

const HeaderName = styled(Stack)`
  ${BoldFont("14px")}
`;

const HeaderUserIcon = styled.div`
  ${Avatar("48px")}
`;

const StyledTabs = styled(Stack)`
  background-color: ${ThemeValues.commonBackColor};

  justify-content: center;
`;

export default {
  Header,
  HeaderName,
  HeaderUserIcon,

  StyledTabs,
};
