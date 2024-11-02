import LowHeader from "./Header";
import { Outlet } from "react-router-dom";

const AuthPage: React.FC = () => {
  return (
    <div>
      <LowHeader />
      <Outlet />
    </div>
  );
};

export default AuthPage;
