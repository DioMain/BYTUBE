import { Divider, Drawer } from "@mui/material";
import { useStores } from "appStoreContext";
import Button0 from "../Button0";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import PropsBase from "@type/PropsBase";
import AuthState from "@type/AuthState";
import HomeIcon from "@mui/icons-material/Home";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import "./style.scss";

interface HDProps extends PropsBase {
  isOpened: boolean;
  closeCallback: () => void;
}

const HeaderDrawer: React.FC<HDProps> = ({ isOpened, closeCallback }) => {
  const { user } = useStores();

  return (
    <Drawer open={isOpened} onClose={closeCallback}>
      <div className="sidebar">
        <div className="sidebar-head">
          <IconButton onClick={closeCallback}>
            <MenuIcon />
          </IconButton>
          <div onClick={() => window.location.assign("/App/Main")} className="sidebar__logo">
            <h2>
              <span style={{ color: "red" }}>B</span>
              <span style={{ color: "green", marginRight: "4px" }}>Y</span>
              TUBE
            </h2>
          </div>
        </div>
        <div className="sidebar-content">
          <Divider />
          {user.status === AuthState.NotAuthed ? (
            <>
              <Button0 text="Войти" prefix={<MenuIcon />} />
            </>
          ) : (
            <>
              <Button0 text="Главная" prefix={<HomeIcon />} />
              <Button0 text="Подписки" prefix={<SubscriptionsIcon />} />
              <Divider />
              <Button0 text="Студиа" prefix={<AddBoxIcon />} />
              <Button0 text="Подписки" prefix={<MenuIcon />} />
              <Divider />
              <Button0 text="Выйти" prefix={<MenuIcon />} />
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default HeaderDrawer;
