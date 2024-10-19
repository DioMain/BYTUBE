import AuthPage from "@components/AuthPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const GeneralRoutes: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/App" />
          <Route path="/Auth" Component={AuthPage} />
          <Route path="/Accaunt" />
          <Route path="/Studio" />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default GeneralRoutes;
