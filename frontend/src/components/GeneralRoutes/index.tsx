import App from "@components/App";
import AuthPage from "@components/AuthPage";
import Register from "@components/Register";
import Signin from "@components/Signin";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const GeneralRoutes: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/App/" Component={App}>
            <Route path="Browser" />
            <Route path="Search" />
            <Route path="Video" />
            <Route path="Channel" />
            <Route path="Playlist" />
          </Route>
          <Route path="/Auth/" Component={AuthPage}>
            <Route path="Signin" Component={Signin} />
            <Route path="Register" Component={Register} />
          </Route>
          <Route path="/Accaunt" />
          <Route path="/Studio" />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default GeneralRoutes;
