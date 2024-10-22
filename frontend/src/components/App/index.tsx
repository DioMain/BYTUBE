import AppHeader from "@components/AppHeader";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  );
};

export default App;
