import AppHeader from "@components/AppHeader";
import useAuth from "@hooks/useAuth";
import { Stack } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";

const PrivacyButton = styled(Stack)`
  color: white;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const App: React.FC = () => {
  const navigator = useNavigate();

  useAuth();

  return (
    <Stack style={{ minHeight: `${window.innerHeight}px` }} justifyContent={"space-between"}>
      <Stack>
        <AppHeader />
        <Outlet />
      </Stack>
      <Stack
        style={{ backgroundColor: "#222", marginTop: "16px", padding: "16px" }}
        justifyContent={"space-between"}
        direction={"row"}
      >
        <Stack style={{ color: "white" }}>StarSverSquad.com</Stack>
        <PrivacyButton onClick={() => navigator("/App/Privacy")}>Политика конфиденциальности</PrivacyButton>
      </Stack>
    </Stack>
  );
};

export default App;
