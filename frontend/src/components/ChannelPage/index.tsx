import { Divider, LinearProgress, Stack } from "@mui/material";
import "./styles.scss";
import { observer } from "mobx-react-lite";
import { useStores } from "appStoreContext";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import GetUrlParams from "@helpers/GetUrlParams";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import ChannelModel from "@type/models/ChannelModel";
import AuthState from "@type/AuthState";
import VideoModel from "@type/models/VideoModel";
import VideoElement from "@components/VideoMain/VideoElement";

const ChannelPage: React.FC = observer(() => {
  const id = GetUrlParams().get("id") as number;

  const { channel, user } = useStores();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [videos, setVideos] = useState<VideoModel[]>([]);

  useEffect(() => {
    axios
      .get(QueriesUrls.CHANNEL_COMMON, {
        params: {
          id: id,
        },
      })
      .then((res: AxiosResponse) => {
        const channelModel = res.data as ChannelModel;

        channel.setChannel(channelModel);
        setIsSubscribed(channelModel.isSubscripted);
      });
  }, []);

  useEffect(() => {
    if (channel !== undefined) {
      axios
        .get(QueriesUrls.GET_CHANNEL_VIDEOS, {
          params: {
            channelId: id,
          },
        })
        .then((res: AxiosResponse) => {
          setVideos(res.data);
        });
    }
  }, [channel.value]);

  const handleSubscribe = () => {
    axios
      .post(QueriesUrls.SUB_USER, null, {
        params: {
          id: id,
        },
      })
      .then(() => {
        setIsSubscribed(true);
      });
  };

  const handleUnsubscribe = () => {
    axios
      .delete(QueriesUrls.SUB_USER, {
        params: {
          id: id,
        },
      })
      .then(() => {
        setIsSubscribed(false);
      });
  };

  if (channel.value === undefined) return <LinearProgress />;

  return (
    <Stack className="channelpage" spacing={2}>
      <Stack className="channelpage__header" style={{ backgroundImage: `url("${channel.value.bannerUrl}")` }}></Stack>

      <Stack direction={"row"} spacing={2}>
        <div className="channelpage__icon" style={{ backgroundImage: `url("${channel.value.iconUrl}")` }}></div>
        <Stack justifyContent={"space-between"}>
          <Stack spacing={1}>
            <h2>{channel.value.name}</h2>
            <p className="channelpage-description">{channel.value.description}</p>
            <div>
              {channel.value.subscribes} подписчиков - {videos.length} видео
            </div>
          </Stack>
          <Stack>
            <button
              className="channelpage__subbutton"
              disabled={user.status !== AuthState.Authed}
              onClick={() => {
                if (isSubscribed) handleUnsubscribe();
                else handleSubscribe();
              }}
            >
              {isSubscribed ? (
                <Stack direction={"row"} spacing={2}>
                  <TurnedInIcon color="success" /> <Stack justifyContent={"center"}>Вы подписаны</Stack>
                </Stack>
              ) : (
                <Stack direction={"row"} spacing={2}>
                  <TurnedInNotIcon /> <Stack justifyContent={"center"}>Подписаться</Stack>
                </Stack>
              )}
            </button>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Stack gap={2} direction={"row"} justifyContent={"center"} flexWrap={"wrap"}>
        {videos.map((item, index) => {
          return <VideoElement key={`channelpage-v-i-${index}`} video={item} />;
        })}
      </Stack>
    </Stack>
  );
});

export default ChannelPage;
