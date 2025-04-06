import { createTheme } from "@mui/material";

const ThemeValues = {
  tinyBorderRadius: "4px",
  smallBorderRadius: "6px",
  commonBorderRadius: "8px",
  bigBorderRadius: "12px",

  tinyPadding: "4px",
  smallPadding: "6px",
  commonPadding: "8px",
  bigPadding: "12px",

  whiteBackColor: "white",
  pageBackColor: "#eee",
  commonBackColor: "#ddd",

  hoveredBackColor: "#d6d6d6",
  selectedBackColor: "#cccccc",
  disabledBackColor: "#999",

  commonFontFamily: "Montserrat",
};

const lightThemeMUI = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: ThemeValues.commonFontFamily,
    allVariants: {
      fontFamily: ThemeValues.commonFontFamily,
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: "14px",
          backgroundColor: "white",
          fontWeight: "500",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          borderRadius: "4px",

          paddingLeft: "2px",
          paddingRight: "2px",
        },
      },
    },
  },
});

export { lightThemeMUI, ThemeValues };
