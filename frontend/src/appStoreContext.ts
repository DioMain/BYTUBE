import StoreWrapper from "@stores/storeWrapper";
import { createContext, useContext } from "react";

export const AppStoreContext = createContext<StoreWrapper | null>(null);

export const useStores = () => {
  const context = useContext(AppStoreContext);

  if (context === null) {
    throw new Error("Context dont defined!");
  }

  return context;
};
