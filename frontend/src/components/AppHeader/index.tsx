import "./style.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Divider, Drawer } from "@mui/material";
import { useState } from "react";

const AppHeader: React.FC = () => {
  const [drawerOpened, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="header">
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="header__sidebarbtn">
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </div>
          <div onClick={() => window.location.assign("/App/Browser")} className="header-logo">
            <h2>
              <span style={{ color: "red" }}>B</span>
              <span style={{ color: "green", marginRight: "4px" }}>Y</span>
              TUBE
            </h2>
          </div>
        </div>
        <div className="header-searchbar">
          <div className="header-searchbar-row">
            <div className="header-searchbar__input">
              <input type="text" id="headerSearchBar" placeholder="Поиск" />
            </div>
            <div className="header-searchbar__sbtn">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </div>
          </div>
        </div>
        <div className="header-accaunt">
          <div>
            <div className="header-accaunt-col0">
              <div>
                <span className="header-accaunt__tbtn" onClick={() => window.location.assign("/Auth/Register")}>
                  Регистрация
                </span>
                {" / "}
                <span className="header-accaunt__tbtn" onClick={() => window.location.assign("/Auth/Signin")}>
                  Вход
                </span>
              </div>
              <div className="header-accaunt__tbtn">USR NAME</div>
            </div>
            <div
              className="header-accaunt__usericon"
              style={{ backgroundImage: "url(/users/template/icon.png)" }}
            ></div>
          </div>
        </div>
      </div>

      <Drawer open={drawerOpened} onClose={() => setDrawerOpen(false)}>
        <div className="sidebar">
          <div className="sidebar-head">
            <IconButton onClick={() => setDrawerOpen(false)}>
              <MenuIcon />
            </IconButton>
            <div onClick={() => window.location.assign("/App/Browser")} className="sidebar__logo">
              <h2>
                <span style={{ color: "red" }}>B</span>
                <span style={{ color: "green", marginRight: "4px" }}>Y</span>
                TUBE
              </h2>
            </div>
          </div>
          <div className="sidebar-content">
            <Divider />
            <Divider />
            <Divider />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default AppHeader;