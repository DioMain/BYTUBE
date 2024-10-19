import ReactDOM from "react-dom";
import GeneralRoutes from "@components/GeneralRoutes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "@styles/Base.scss";
import "@styles/Fonts.scss";

ReactDOM.render(
  <Provider store={store}>
    <GeneralRoutes />
  </Provider>,
  document.getElementById("root")
);
