import { Divider, Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { useStores } from "appStoreContext";
import Button0 from "./HeaderDrawerButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import PropsBase from "@type/PropsBase";
import AuthState from "@type/AuthState";
import HomeIcon from "@mui/icons-material/Home";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import axios, { AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import ChannelModel from "@type/models/ChannelModel";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Role } from "@type/models/UserModel";

import "./style.scss";

interface HDProps extends PropsBase {
  isOpened: boolean;
  closeCallback?: () => void;
  onClickChannelCreation?: () => void;
}

const HeaderDrawer: React.FC<HDProps> = ({ isOpened, closeCallback, onClickChannelCreation }) => {
  const { user } = useStores();

  const [channelsList, setChannelsList] = useState<ChannelModel[]>([]);

  useEffect(() => {
    if (user.status === AuthState.Authed) {
      axios.get(QueriesUrls.GET_USER_CHANNELS_LIST).then((res: AxiosResponse) => {
        setChannelsList(res.data);
      });
    }
  }, [user.value]);

  const handleSignout = () => {
    axios.get(QueriesUrls.SIGNOUT).then(() => {
      window.location.reload();
    });
  };

  const handleClickChannel = (channelId: number) => {
    window.location.assign(`/Studio?channelid=${channelId}`);
  };

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
              <Button0 text="Войти" prefix={<MenuIcon />} onClick={() => window.location.assign("/Auth/Signin")} />
            </>
          ) : (
            <>
              <Button0 text="Главная" prefix={<HomeIcon />} />
              <Button0 text="Подписки" prefix={<SubscriptionsIcon />} />
              <Divider />
              <h5>Каналы</h5>
              {channelsList.map((item, index) => {
                return (
                  <Button0
                    text={`${item.name}`}
                    prefix={
                      <div
                        className="sidebar-content-channel-item-icon"
                        style={{ backgroundImage: `url("${item.iconUrl}")` }}
                      ></div>
                    }
                    key={`channellistitem${index}`}
                    onClick={() => handleClickChannel(item.id)}
                  />
                );
              })}
              <Button0 text="Создать канал" prefix={<AddBoxIcon />} onClick={onClickChannelCreation} />
              <Divider />
              <h5>Плейлисты</h5>
              <Button0 text="Создать плейлист" prefix={<AddBoxIcon />} />
              <Divider />
              {user.value?.role === Role.Admin && (
                <>
                  <Button0 text="Панель аминистратора" prefix={<AdminPanelSettingsIcon />} />
                  <Divider />
                </>
              )}
              <Button0 text="Выйти" prefix={<MenuIcon />} onClick={handleSignout} />
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default HeaderDrawer;
