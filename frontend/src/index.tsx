import ReactDOM from "react-dom";
import App from "@components/App";
import "./styles/Base.scss";
import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
