import AdminPage from "@components/AdminPage";
import App from "@components/App";
import AuthPage from "@components/AuthPage";
import Register from "@components/AuthPage/Register";
import Signin from "@components/AuthPage/Signin";
import ChannelPage from "@components/ChannelPage";
import PrivacyPage from "@components/PrivacyPage";
import SearchPage from "@components/SearchPage";
import StudioPage from "@components/StudioPage";
import VideoMain from "@components/VideoMain";
import VideoPage from "@components/VideoPage";
import WatchTogether from "@components/WatchTogether";
import W2GMainPage from "@components/WatchTogether/MainPage";
import W2GWatchPage from "@components/WatchTogether/WatchPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const GeneralRoutes: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/App/" Component={App}>
            <Route path="Main" Component={VideoMain} />
            <Route path="Search" Component={SearchPage} />
            <Route path="Video" Component={VideoPage} />
            <Route path="Channel" Component={ChannelPage} />
            <Route path="Privacy" Component={PrivacyPage} />
            <Route path="WatchTogether/" Component={WatchTogether}>
              <Route path="Main" Component={W2GMainPage} />
              <Route path="Lobby" Component={W2GWatchPage} />
            </Route>
          </Route>
          <Route path="/Auth/" Component={AuthPage}>
            <Route path="Signin" Component={Signin} />
            <Route path="Register" Component={Register} />
          </Route>
          <Route path="/Studio" Component={StudioPage} />
          <Route path="/Admin" Component={AdminPage} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default GeneralRoutes;
