enum ReportType {
  SexyalContent = 0,
  GoreContent,
  InsultContent,
  BullyOrAbuse,
  LieInCriticalInfomation,
  GoreWithChildren,
  Terrorism,
  SpamOrLie,
  NatinalLawBreaking,

  Other = 99,
}

interface ReportModel {
  id: string;
  description: string;
  type: ReportType;

  videoId: string;
  created?: string;
}

export default ReportModel;

export { ReportType };
