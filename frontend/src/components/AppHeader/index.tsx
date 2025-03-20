import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback, useRef, useState } from "react";
import { useStores } from "appStoreContext";
import { observer } from "mobx-react-lite";
import AuthState from "@type/AuthState";
import HeaderDrawer from "./HeaderDrawer";
import CreateChannelModal from "./CreateChannelModal";
import { Stack } from "@mui/material";
import Logo from "@components/Logo";
import CreatePlaylistModal from "./CreatePlaylistModal";
import PlaylistModel from "@type/models/PlaylistModel";
import PlaylistListModal from "./PlaylistModal";
import QueriesUrls from "@helpers/QeuriesUrls";
import GetUrlParams from "@helpers/GetUrlParams";
import { useNavigate } from "react-router-dom";
import IconPlaceholder from "@assets/images/UnknownUser.jpg";
import "./style.scss";

const AppHeader: React.FC = observer(() => {
  const search = GetUrlParams().get("search") ?? "";

  const navigator = useNavigate();

  const searchBarField = useRef<HTMLInputElement>(null);

  const [drawerOpened, setDrawerOpen] = useState(false);
  const [channelCreationOpened, setChannelCreationOpened] = useState(false);
  const [playlistCreationOpened, setPlaylistCreationOpened] = useState(false);
  const [playlistViewOpened, setPlaylistViewOpened] = useState(false);
  const [playlist, setPlaylist] = useState<PlaylistModel | null>(null);

  const { user, searchData } = useStores();

  const handleOpenChannelCreation = useCallback(() => {
    setChannelCreationOpened(true);
    setDrawerOpen(false);
  }, [setChannelCreationOpened, setDrawerOpen]);

  const handleOpenPlaylistCreate = useCallback(() => {
    setPlaylistCreationOpened(true);
    setDrawerOpen(false);
  }, [setPlaylistCreationOpened, setDrawerOpen]);

  const handleOpenPlaylistView = useCallback(
    (playlist: PlaylistModel) => {
      setPlaylist(playlist);
      setPlaylistViewOpened(true);
      setDrawerOpen(false);
    },
    [setPlaylistViewOpened, setDrawerOpen, setPlaylist]
  );

  const handleSearch = () => {
    let url = new URL(QueriesUrls.SEARCH_PAGE, window.location.origin);
    url.searchParams.set("search", searchBarField.current?.value as string);

    window.location.assign(url.toString());
  };

  const iconUrl = user.value ? `url(${user.value.iconUrl})` : `url(${IconPlaceholder})`;

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
              <input type="text" placeholder="Поиск" ref={searchBarField} defaultValue={search} />
            </Stack>
            <Stack className="header-searchbar__sbtn" justifyContent={"center"} onClick={handleSearch}>
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
        onClickPlaylistCreation={handleOpenPlaylistCreate}
        onClickPlaylistOpenView={handleOpenPlaylistView}
      />

      <CreateChannelModal isOpened={channelCreationOpened} closeCallback={() => setChannelCreationOpened(false)} />

      <CreatePlaylistModal opened={playlistCreationOpened} onClose={() => setPlaylistCreationOpened(false)} />

      <PlaylistListModal
        opened={playlistViewOpened}
        playlist={playlist}
        onClose={() => {
          setPlaylistViewOpened(false);
          setPlaylist(null);
        }}
      />
    </>
  );
});

export default AppHeader;
