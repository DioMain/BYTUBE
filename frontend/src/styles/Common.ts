import { Box } from "@mui/material";
import styled from "styled-components";

const BoxStyled = styled(Box)({
  top: "50%",
  left: "50%",
  position: "absolute",
  backgroundColor: "#DDD",
  padding: "12px",
  borderRadius: "8px",
  transform: "translate(-50%, -50%)",
});

export { BoxStyled };
