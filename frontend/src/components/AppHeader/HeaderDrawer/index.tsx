import { Divider, Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { useStores } from "appStoreContext";
import HeaderDrawerButton from "./HeaderDrawerButton";
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
import { PlaylistPlay } from "@mui/icons-material";

interface HDProps extends PropsBase {
  isOpened: boolean;
  closeCallback?: () => void;
  onClickChannelCreation?: () => void;
  onClickPlaylistCreation?: () => void;
  onClickPlaylistOpenView?: (playlistId: number) => void;
}

const HeaderDrawer: React.FC<HDProps> = ({
  isOpened,
  closeCallback,
  onClickChannelCreation,
  onClickPlaylistCreation,
  onClickPlaylistOpenView,
}) => {
  const { user } = useStores();

  const [channelsList, setChannelsList] = useState<ChannelModel[]>([]);
  const [playlistList, setPlaylistList] = useState<ChannelModel[]>([]);

  useEffect(() => {
    if (user.status === AuthState.Authed) {
      axios.get(QueriesUrls.GET_USER_CHANNELS_LIST).then((res: AxiosResponse) => {
        setChannelsList(res.data);
      });

      axios.get(QueriesUrls.GET_USER_PLAYLISTS).then((res: AxiosResponse) => {
        setPlaylistList(res.data);
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

  const handleClickPlaylist = (channelId: number) => {
    if (onClickPlaylistOpenView) onClickPlaylistOpenView(channelId);
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
              <HeaderDrawerButton
                text="Войти"
                prefix={<MenuIcon />}
                onClick={() => window.location.assign("/Auth/Signin")}
              />
            </>
          ) : (
            <>
              <HeaderDrawerButton text="Главная" prefix={<HomeIcon />} />
              <HeaderDrawerButton text="Подписки" prefix={<SubscriptionsIcon />} />
              <Divider />
              <h5>Каналы</h5>
              {channelsList.map((item, index) => {
                return (
                  <HeaderDrawerButton
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
              <HeaderDrawerButton text="Создать канал" prefix={<AddBoxIcon />} onClick={onClickChannelCreation} />
              <Divider />
              <h5>Плейлисты</h5>
              {playlistList.map((item, index) => {
                return (
                  <HeaderDrawerButton
                    key={`pl-i-${index}`}
                    onClick={() => handleClickPlaylist(item.id)}
                    text={item.name}
                    prefix={<PlaylistPlay />}
                  />
                );
              })}
              <HeaderDrawerButton text="Создать плейлист" prefix={<AddBoxIcon />} onClick={onClickPlaylistCreation} />
              <Divider />
              {user.value?.role === Role.Admin && (
                <>
                  <HeaderDrawerButton text="Панель аминистратора" prefix={<AdminPanelSettingsIcon />} />
                  <Divider />
                </>
              )}
              <HeaderDrawerButton text="Выйти" prefix={<MenuIcon />} onClick={handleSignout} />
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default HeaderDrawer;
