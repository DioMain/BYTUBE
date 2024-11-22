const QueriesUrls = {
  MAIN_PAGE: "/App/Main",

  AUTH: "/api/user/auth",
  REGISTER: "/api/auth/register",
  SIGNIN: "/api/auth/signin",
  SIGNOUT: "/api/auth/signout",

  GET_USERICON: "/api/user/geticon",
  GET_USER_CHANNELS_LIST: "/api/user/channelslist",

  VIDEO_COMMON: "/api/video",
  GET_VIDEOS: "/api/video/select",
  GET_VIDEO_MARKS: "/api/video/mark",
  VIDEO_LIKE: "/api/video/like",
  VIDEO_DISLIKE: "/api/video/dislike",
  VIDEO_ADD_VIEW: "/api/video/view",

  CHANNEL_COMMON: "/api/channel",
  GET_CHANNEL_VIDEOS: "/api/video/channel",
  CHECK_CHENNEL_IS_OWN: "/api/channel/check",

  PLAYLIST_COMMON: "/api/playlist",
  GET_USER_PLAYLISTS: "/api/playlist/user",
};

export default QueriesUrls;
