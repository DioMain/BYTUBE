import { Stack } from "@mui/material";
import "./style.scss";
import VideoModel from "@type/models/VideoModel";
import { useEffect, useState } from "react";
import ReportModel, { ReportType } from "@type/models/ReportModel";
import axios, { AxiosResponse } from "axios";
import QueriesUrls from "@helpers/QeuriesUrls";

interface ReportView_Props {
  video: VideoModel;
}

const ReportView: React.FC<ReportView_Props> = ({ video }) => {
  const [reports, setReports] = useState<ReportModel[]>([]);

  useEffect(() => {
    axios
      .get(QueriesUrls.GET_VIDEO_REPORTS, {
        params: {
          vid: video.id,
        },
      })
      .then((res: AxiosResponse) => {
        setReports(res.data);
      });
  }, [video]);

  return (
    <Stack spacing={2}>
      <h1 style={{ textAlign: "center" }}>Жалаобы по теме</h1>
      <h4>Пахабный контент: {reports.filter((i) => i.type === ReportType.SexyalContent).length}</h4>
      <h4>Насилие в контенте: {reports.filter((i) => i.type === ReportType.GoreContent).length}</h4>
      <h4>Шокирующий контент: {reports.filter((i) => i.type === ReportType.InsultContent).length}</h4>
      <h4>Издевательство или абьюз: {reports.filter((i) => i.type === ReportType.BullyOrAbuse).length}</h4>
      <h4>
        Ложь в критической информации: {reports.filter((i) => i.type === ReportType.LieInCriticalInfomation).length}
      </h4>
      <h4>Насилие над детьми: {reports.filter((i) => i.type === ReportType.GoreWithChildren).length}</h4>
      <h4>Демонстрация терроризма: {reports.filter((i) => i.type === ReportType.Terrorism).length}</h4>
      <h4>Ввод в заблуждение: {reports.filter((i) => i.type === ReportType.SpamOrLie).length}</h4>
      <h4>Нарушение закона: {reports.filter((i) => i.type === ReportType.NatinalLawBreaking).length}</h4>
      <h2>Другие жалобы</h2>
      {reports
        .filter((i) => i.type === ReportType.Other)
        .map((item, index) => {
          return (
            <Stack
              spacing={1}
              style={{ backgroundColor: "#202020", borderRadius: "8px", padding: "8px" }}
              key={`RV-O-I-${index}`}
            >
              <div style={{ fontSize: "16px" }}>{item.description}</div>
            </Stack>
          );
        })}
    </Stack>
  );
};

export default ReportView;
