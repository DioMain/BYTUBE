import { createTheme, Stack, styled } from "@mui/material";

const lightThemeMUI = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: "Montserrat",
    allVariants: {
      fontFamily: "Montserrat",
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        standard: {
          backgroundColor: "white",
        },
      },
    },
  },
});

const ThemeValues = {
  tinyBorderRadius: "4px",
  smallBorderRadius: "6px",
  commonBorderRadius: "8px",
  bigBorderRadius: "12px",

  smallPadding: "6px",
  commonPadding: "8px",
  bigPadding: "12px",

  whiteBackColor: "white",
  commonBackColor: "#eee",
  contrastBackColor: "#ddd",

  commonFontFamily: "Montserrat",
};

export { lightThemeMUI, ThemeValues };
