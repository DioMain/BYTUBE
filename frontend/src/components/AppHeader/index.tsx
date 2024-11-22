import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback, useState } from "react";
import { useStores } from "appStoreContext";
import { observer } from "mobx-react-lite";
import AuthState from "@type/AuthState";
import HeaderDrawer from "./HeaderDrawer";
import "./style.scss";
import CreateChannelModal from "./CreateChannelModal";
import { Stack } from "@mui/material";
import Logo from "@components/Logo";

const AppHeader: React.FC = observer(() => {
  const [drawerOpened, setDrawerOpen] = useState(false);
  const [channelCreationOpened, setChannelCreationOpened] = useState(false);
  const { user } = useStores();

  const handleOpenChannelCreation = useCallback(() => {
    setChannelCreationOpened(true);
    setDrawerOpen(false);
  }, [setChannelCreationOpened, setDrawerOpen]);

  const iconUrl = user.value ? `url(${user.value.iconUrl})` : "url(/data/users/template/icon.png)";

  return (
    <>
      <div className="header">
        <Stack direction={"row"} spacing={"8px"} justifyContent={"center"}>
          <Stack justifyContent={"center"}>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Stack>
          <Logo />
        </Stack>
        <div className="header-searchbar">
          <div className="header-searchbar__r">
            <Stack className="header-searchbar__input" justifyContent={"center"}>
              <input type="text" id="headerSearchBar" placeholder="Поиск" />
            </Stack>
            <Stack className="header-searchbar__sbtn" justifyContent={"center"}>
              <SearchIcon />
            </Stack>
          </div>
        </div>
        <Stack justifyContent={"center"} className="header-accaunt" direction={"row"}>
          <Stack direction={"row"} spacing={"8px"}>
            <Stack justifyContent={"center"}>
              {user.status === AuthState.Authed ? (
                <div className="header-accaunt__tbtn">{user.value?.name}</div>
              ) : (
                <div>
                  <span className="header-accaunt__tbtn" onClick={() => window.location.assign("/Auth/Register")}>
                    Регистрация
                  </span>
                  {" / "}
                  <span className="header-accaunt__tbtn" onClick={() => window.location.assign("/Auth/Signin")}>
                    Вход
                  </span>
                </div>
              )}
            </Stack>
            <div className="header-accaunt__usericon" style={{ backgroundImage: iconUrl }}></div>
          </Stack>
        </Stack>
      </div>

      <HeaderDrawer
        isOpened={drawerOpened}
        closeCallback={() => setDrawerOpen(false)}
        onClickChannelCreation={handleOpenChannelCreation}
      />
      <CreateChannelModal isOpened={channelCreationOpened} closeCallback={() => setChannelCreationOpened(false)} />
    </>
  );
});

export default AppHeader;
