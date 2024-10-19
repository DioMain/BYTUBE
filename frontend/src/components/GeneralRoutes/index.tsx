import AuthPage from "@components/AuthPage";
import Signin from "@components/Signin";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

const GeneralRoutes: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/App/">
            <Route path="Catalog" />
            <Route path="Search" />
            <Route path="Video" />
            <Route path="Channel" />
            <Route path="Playlist" />
          </Route>
          <Route path="/Auth/" element={<AuthPage />}>
            <Route path="Signin" element={<Signin />} />
            <Route path="Register" />
          </Route>
          <Route path="/Accaunt" />
          <Route path="/Studio" />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default GeneralRoutes;
