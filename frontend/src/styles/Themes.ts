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

export { lightThemeMUI };
