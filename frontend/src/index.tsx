import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import GeneralRoutes from "@components/GeneralRoutes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import "@styles/Base.scss";
import "@styles/Fonts.scss";
import { AppStoreContext } from "appStoreContext";
import StoreWrapper from "@stores/storeWrapper";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <AppStoreContext.Provider value={new StoreWrapper()}>
    <ThemeProvider theme={darkTheme}>
      <GeneralRoutes />
    </ThemeProvider>
  </AppStoreContext.Provider>
);
