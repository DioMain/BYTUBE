import AdminControllDTO from "@type/ChannelControllDTO";
import styles from "./styled";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Stack } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useEffect, useState } from "react";
import VideoModel from "@type/models/VideoModel";
import axios, { AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";
import ImageWithDuration from "@components/ImageWithDuration";
import ChannelVideoItem from "./ChannelVideoItem";

interface ChannelViewProps {
  item: AdminControllDTO | null;
}

const ChannelView: React.FC<ChannelViewProps> = ({ item }) => {
  const [videos, setVideos] = useState<VideoModel[]>([]);

  useEffect(() => {
    if (item === null) return;

    axios
      .get(QueriesUrls.GET_CHANNEL_VIDEOS, {
        params: {
          channelId: item.channel.id,
        },
      })
      .then((res: AxiosResponse) => {
        setVideos(res.data);
      });
  }, [item]);

  return (
    <styles.ChannelView spacing={2}>
      {item === null ? (
        <Alert severity="info">Канал не выбран!</Alert>
      ) : (
        <>
          <styles.ChannelBanner style={{ backgroundImage: `url(${item.channel.bannerUrl})` }}>
            <styles.ChannelBanner_Title>{item.channel.name}</styles.ChannelBanner_Title>
          </styles.ChannelBanner>

          <p>{item.channel.description}</p>

          <Stack direction={"row"} justifyContent={"center"} spacing={1}>
            <styles.UserView>
              <h4>Автор канала:</h4>
              <Stack direction="row" spacing={1}>
                <styles.UserIcon style={{ backgroundImage: `url(${item.user.iconUrl})` }} />
                <h3>{item.user.name}</h3>
              </Stack>
            </styles.UserView>
          </Stack>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>Видео</AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                {videos.map((video, index) => {
                  return <ChannelVideoItem video={video} key={`channel-video-${index}`} />;
                })}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </styles.ChannelView>
  );
};

export default ChannelView;
