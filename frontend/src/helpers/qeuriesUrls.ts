const QueriesUrls = {
  MAIN_PAGE: "/App/Main",
  VIDEO_PAGE: "/App/Video",
  CHANNEL_PAGE: "/App/Channel",
  SEARCH_PAGE: "/App/Search",

  AUTH: "/api/user/auth",
  REGISTER: "/api/auth/register",
  SIGNIN: "/api/auth/signin",
  SIGNOUT: "/api/auth/signout",

  GET_USERICON: "/api/user/geticon",
  GET_USER_CHANNELS_LIST: "/api/user/channelslist",

  VIDEO_COMMON: "/api/video",
  VIDEO_DELETE_BY_ADMIN: "/api/video/delete",
  VIDEO_CHANGE_STATUS_BY_ADMIN: "/api/video/status",
  GET_VIDEOS: "/api/video/select",
  GET_PLAYLIST_VIDEOS: "/api/video/playlist",
  GET_VIDEO_MARKS: "/api/video/mark",
  VIDEO_MARK: "/api/video/mark",
  VIDEO_VIEW_COMMON: "/api/video/view",

  CHANNEL_COMMON: "/api/channel",
  GET_CHANNEL_VIDEOS: "/api/video/channel",
  CHECK_CHENNEL_IS_OWN: "/api/channel/check",
  GET_USER_SUB_CHANNELS: "/api/channel/user",
  SUB_USER: "/api/channel/subscribe",
  GET_CHANNELS_BY_ADMIN: "/api/channel/getchannelsbyadmin",
  SET_CHANNEL_STATUS_BY_ADMIN: "/api/channel/statusbyadmin",
  DELETE_CHANNEL_BY_ADMIN: "/api/channel/deletebyadmin",

  PLAYLIST_COMMON: "/api/playlist",
  GET_USER_PLAYLISTS: "/api/playlist/user",
  ADD_ELEMENT_TO_PLAYLIST: "/api/playlist/add",
  REMOVE_ELEMENT_FROM_PLAYLIST: "/api/playlist/remove",

  COMMENT_COMMON: "/api/comment",
  COMMENT_LIKE: "/api/comment/like",
  GET_VIDEO_COMMENTS: "/api/comment/video",

  REPORT_COMMON: "/api/report",
  GET_VIDEO_REPORTS: "/api/report/video",

  GET_W2G_LOBBYS: "/api/watchtogether/lobbys",
  W2G_LOBBYS_COMMON: "/api/watchtogether/lobby",
  W2G_LOBBYS_TRY: "/api/watchtogether/try",
  W2G_LOBBYS_PASS: "/api/watchtogether/pass",
};

export default QueriesUrls;
