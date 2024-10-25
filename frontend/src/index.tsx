import { createRoot } from "react-dom/client";
import GeneralRoutes from "@components/GeneralRoutes";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { AppStoreContext } from "appStoreContext";
import StoreWrapper from "@stores/storeWrapper";
import "@styles/Base.scss";
import "@styles/Fonts.scss";

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
