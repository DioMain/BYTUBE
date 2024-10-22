import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import GeneralRoutes from "@components/GeneralRoutes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import "@styles/Base.scss";
import "@styles/Fonts.scss";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <GeneralRoutes />
    </ThemeProvider>
  </Provider>
);
