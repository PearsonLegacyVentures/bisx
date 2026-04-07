export type ImportResult = {
  jobName: string;
  status: "success" | "failed";
  recordsCreated: number;
  recordsUpdated: number;
  message?: string;
};
