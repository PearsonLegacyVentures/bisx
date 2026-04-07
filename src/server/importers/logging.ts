import { prisma } from "@/lib/prisma";
import { ImportResult } from "./types";

export async function saveImportLog(result: ImportResult, startedAt: Date) {
  await prisma.importLog.create({
    data: {
      jobName: result.jobName,
      status: result.status,
      startedAt,
      finishedAt: new Date(),
      recordsCreated: result.recordsCreated,
      recordsUpdated: result.recordsUpdated,
      message: result.message
    }
  });
}
