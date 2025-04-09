import { Input } from "@mui/material";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const DateInput = styled(Input)`
  padding: ${ThemeValues.commonPadding};

  border-radius: ${ThemeValues.tinyBorderRadius};

  border: 1px solid rgb(188, 188, 188);
`;

export default {
  DateInput,
};
