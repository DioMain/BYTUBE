import AppHeader from "@components/AppHeader";
import useAuth from "@hooks/useAuth";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  useAuth();

  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  );
};

export default App;
