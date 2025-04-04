import AppHeader from "@components/AppHeader";
import useAuth from "@hooks/useAuth";
import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  useAuth();

  return (
    <Stack style={{ minHeight: "800px" }} justifyContent={"space-between"}>
      <Stack>
        <AppHeader />
        <Outlet />
      </Stack>
      <Stack style={{ backgroundColor: "#080808", marginTop: "16px" }}>
        <Stack style={{ margin: "16px", color: "white" }}>StarSverSquad.com</Stack>
      </Stack>
    </Stack>
  );
};

export default App;
