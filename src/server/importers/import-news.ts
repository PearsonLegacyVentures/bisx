import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { saveImportLog } from "./logging";

const NewsSchema = z.object({
  title: z.string(),
  slug: z.string(),
  publishedAt: z.string(),
  issuerName: z.string().optional(),
  securitySymbol: z.string().optional(),
  summary: z.string().optional(),
  sourceUrl: z.string().url()
});

export async function importNews() {
  const startedAt = new Date();
  let recordsCreated = 0;
  try {
    const rows = [
      { title: "FOCOL posts interim earnings", slug: "fcl-interim-earnings", publishedAt: "2026-04-03", issuerName: "FOCOL Holdings Ltd.", securitySymbol: "FCL", summary: "Interim release published on BISX issuer feed.", sourceUrl: "https://bisxbahamas.com/news/fcl-interim-earnings" }
    ].map((x) => NewsSchema.parse(x));

    for (const row of rows) {
      await prisma.newsItem.upsert({ where: { sourceUrl: row.sourceUrl }, update: { ...row, publishedAt: new Date(row.publishedAt), importedAt: new Date() }, create: { ...row, publishedAt: new Date(row.publishedAt) } });
      recordsCreated += 1;
    }

    await saveImportLog({ jobName: "import:news", status: "success", recordsCreated, recordsUpdated: 0 }, startedAt);
  } catch (error) {
    await saveImportLog({ jobName: "import:news", status: "failed", recordsCreated, recordsUpdated: 0, message: (error as Error).message }, startedAt);
    throw error;
  }
}
