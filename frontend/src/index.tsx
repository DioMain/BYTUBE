import { createRoot } from "react-dom/client";
import GeneralRoutes from "@components/GeneralRoutes";
import { ThemeProvider } from "@emotion/react";
import { AppStoreContext } from "appStoreContext";
import StoreWrapper from "@stores/StoreWrapper";
import "@styles/Fonts.scss";
import "@styles/Base.scss";
import { lightThemeMUI } from "@styles/Themes";
import GlobalStyles from "@styles/Global";

createRoot(document.getElementById("root")!).render(
  <AppStoreContext.Provider value={new StoreWrapper()}>
    <ThemeProvider theme={lightThemeMUI}>
      <GlobalStyles />
      <GeneralRoutes />
    </ThemeProvider>
  </AppStoreContext.Provider>
);
