import QueriesUrls from "@helpers/QeuriesUrls";
import { CopyAll } from "@mui/icons-material";
import { Stack, IconButton, Tooltip } from "@mui/material";
import { ThemeValues } from "@styles/Themes";
import VideoViewModel from "@type/models/VideoViewModel";
import { useStores } from "appStoreContext";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Legend,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";

const VideoLink = styled(Stack)`
  padding: ${ThemeValues.commonPadding};
  background-color: ${ThemeValues.commonBackColor};
  border-radius: ${ThemeValues.commonBorderRadius};
`;

interface DataPoint {
  dayOfMonth: number;
  views: number;
}

const VideoStats: React.FC = () => {
  const { video } = useStores();

  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (video.value === undefined) return;

    axios
      .get(QueriesUrls.VIDEO_VIEW_COMMON, {
        params: {
          id: video.value.id,
        },
      })
      .then((res) => {
        const views = res.data as VideoViewModel[];
        const today = new Date(Date.now());

        const days = new Array<DataPoint>(today.getDate());

        for (let index = 0; index < days.length; index++) {
          days[index] = { dayOfMonth: 0, views: 0 };
          const element = days[index];

          const date = new Date(Date.now());
          date.setDate(index + 1);

          element.dayOfMonth = date.getDate();
          element.views = views.filter((v) => {
            const vdate = new Date(v.created);

            return vdate.getUTCDate() === date.getUTCDate();
          }).length;
        }

        setDataPoints(days);
      });
  }, [video]);

  return (
    <Stack style={{ marginLeft: "32px", marginRight: "32px" }} spacing={2}>
      <Stack>
        <h3>Ссылка на видео</h3>
        <Stack direction={"row"} spacing={1}>
          <VideoLink justifyContent={"center"}>
            {window.location.origin}/App/Video?id={video.value?.id}
          </VideoLink>
          <Tooltip title="Копировать в буфер обмена">
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/App/Video?id=${video.value?.id}`);
              }}
            >
              <CopyAll />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack>Общее число просмотров: {video.value?.views}</Stack>

      <Stack>
        <h3 style={{ textAlign: "center" }}>График просмотров за текущий месяц</h3>
        <Stack height={"500px"} justifyContent={"center"} direction={"row"}>
          <ResponsiveContainer width="75%" height="100%">
            <LineChart data={dataPoints} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dayOfMonth"
                label={{ value: "День месяца", position: "insideBottomRight", offset: -10 }}
              />
              <YAxis label={{ value: "Просмотры", angle: -90, position: "insideLeft" }} />
              <RTooltip
                formatter={(value) => [`${value} просмотров`, ""]}
                labelFormatter={(label) => `День ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name="Просмотры"
              />
            </LineChart>
          </ResponsiveContainer>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VideoStats;
