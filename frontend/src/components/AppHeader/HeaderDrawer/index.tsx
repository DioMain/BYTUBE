import { Divider, Drawer, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useStores } from "appStoreContext";
import HeaderDrawerButton from "./HeaderDrawerButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AuthState from "@type/AuthState";
import HomeIcon from "@mui/icons-material/Home";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import axios, { AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import ChannelModel from "@type/models/ChannelModel";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Role } from "@type/models/UserModel";
import PlaylistModel, { PlaylistAccess } from "@type/models/PlaylistModel";
import { Favorite, Lock, PlaylistPlay } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./style.scss";
import { HeaderDrawerProps } from "./types";
import { MainPageFilter } from "@stores/SearchDataStore";
import { observer } from "mobx-react-lite";

const HeaderDrawer: React.FC<HeaderDrawerProps> = observer(
  ({ isOpened, closeCallback, onClickChannelCreation, onClickPlaylistCreation, onClickPlaylistOpenView }) => {
    const { user, searchData } = useStores();

    const [channelsList, setChannelsList] = useState<ChannelModel[]>([]);
    const [playlistList, setPlaylistList] = useState<PlaylistModel[]>([]);
    const [subcribesList, setSubcribesList] = useState<ChannelModel[]>([]);

    useEffect(() => {
      if (user.status === AuthState.Authed) {
        axios.get(QueriesUrls.GET_USER_CHANNELS_LIST).then((res: AxiosResponse) => {
          setChannelsList(res.data);
        });

        axios.get(QueriesUrls.GET_USER_PLAYLISTS).then((res: AxiosResponse) => {
          setPlaylistList(res.data);
        });

        axios.get(QueriesUrls.GET_USER_SUB_CHANNELS).then((res: AxiosResponse) => {
          setSubcribesList(res.data);
        });
      }
    }, [user.status]);

    const handleSignout = () => {
      axios.get(QueriesUrls.SIGNOUT).then(() => {
        window.location.reload();
      });
    };

    const handleClickChannel = (channelId: string) => {
      window.location.assign(`/Studio?channelid=${channelId}`);
    };

    const handleClickPlaylist = (playlist: PlaylistModel) => {
      if (onClickPlaylistOpenView) onClickPlaylistOpenView(playlist);
    };

    const handleMainPageFilter = (filter: MainPageFilter) => {
      searchData.setMainPageFilter(filter);
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
                  prefix={<AccountCircleIcon />}
                  onClick={() => window.location.assign("/Auth/Signin")}
                />
              </>
            ) : (
              <>
                {window.location.pathname === QueriesUrls.MAIN_PAGE ? (
                  <>
                    <HeaderDrawerButton
                      onClick={() => handleMainPageFilter(MainPageFilter.Main)}
                      text="Главная"
                      selected={
                        searchData.selectOptions === undefined && searchData.mainPageFilter === MainPageFilter.Main
                      }
                      prefix={<HomeIcon />}
                    />
                    <HeaderDrawerButton
                      onClick={() => handleMainPageFilter(MainPageFilter.Subs)}
                      text="Подписки"
                      selected={
                        searchData.selectOptions === undefined && searchData.mainPageFilter === MainPageFilter.Subs
                      }
                      prefix={<SubscriptionsIcon />}
                    />
                    <HeaderDrawerButton
                      onClick={() => handleMainPageFilter(MainPageFilter.Favorite)}
                      text="Понравившиеся"
                      selected={
                        searchData.selectOptions === undefined && searchData.mainPageFilter === MainPageFilter.Favorite
                      }
                      prefix={<Favorite />}
                    />
                  </>
                ) : (
                  <HeaderDrawerButton
                    onClick={() => window.location.assign(QueriesUrls.MAIN_PAGE)}
                    text="На главную"
                    prefix={<HomeOutlinedIcon />}
                  />
                )}
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
                      onClick={() => handleClickPlaylist(item)}
                      text={item.name}
                      prefix={<PlaylistPlay />}
                      postfix={item.access === PlaylistAccess.Private && <Lock fontSize="small" />}
                    />
                  );
                })}
                <HeaderDrawerButton text="Создать плейлист" prefix={<AddBoxIcon />} onClick={onClickPlaylistCreation} />
                <Divider />
                <h5>Подписки</h5>
                {subcribesList.map((item, index) => {
                  return (
                    <HeaderDrawerButton
                      text={`${item.name}`}
                      prefix={
                        <div
                          className="sidebar-content-channel-item-icon"
                          style={{ backgroundImage: `url("${item.iconUrl}")` }}
                        ></div>
                      }
                      key={`subs-item${index}`}
                      onClick={() => window.location.assign(`${QueriesUrls.CHANNEL_PAGE}?id=${item.id}`)}
                    />
                  );
                })}
                <Divider />
                {user.value?.role === Role.Admin && (
                  <>
                    <HeaderDrawerButton
                      text="Панель аминистратора"
                      onClick={() => window.location.assign("/Admin")}
                      prefix={<AdminPanelSettingsIcon />}
                    />
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
  }
);

export default HeaderDrawer;
