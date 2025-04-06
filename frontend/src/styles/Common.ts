import { Box } from "@mui/material";
import styled from "styled-components";
import { ThemeValues } from "./Themes";

const BoxStyled = styled(Box)({
  top: "50%",
  left: "50%",
  position: "absolute",
  backgroundColor: ThemeValues.commonBackColor,
  padding: ThemeValues.bigPadding,
  borderRadius: ThemeValues.commonBorderRadius,
  transform: "translate(-50%, -50%)",
});

export { BoxStyled };
