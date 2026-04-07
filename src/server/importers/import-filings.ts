import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { saveImportLog } from "./logging";

const FilingSchema = z.object({
  title: z.string(),
  filingType: z.string(),
  issuerName: z.string().optional(),
  securitySymbol: z.string().optional(),
  publishedAt: z.string(),
  documentUrl: z.string().url(),
  sourceUrl: z.string().url()
});

export async function importFilings() {
  const startedAt = new Date();
  let recordsCreated = 0;
  try {
    const rows = [
      { title: "FCL Interim Financial Statements", filingType: "Interim Statements", issuerName: "FOCOL Holdings Ltd.", securitySymbol: "FCL", publishedAt: "2026-04-03", documentUrl: "https://bisxbahamas.com/docs/fcl-interim-2026.pdf", sourceUrl: "https://bisxbahamas.com/filings/fcl-interim-2026" }
    ].map((x) => FilingSchema.parse(x));

    for (const row of rows) {
      await prisma.filing.upsert({ where: { sourceUrl: row.sourceUrl }, update: { ...row, publishedAt: new Date(row.publishedAt), importedAt: new Date() }, create: { ...row, publishedAt: new Date(row.publishedAt) } });
      recordsCreated += 1;
    }

    await saveImportLog({ jobName: "import:filings", status: "success", recordsCreated, recordsUpdated: 0 }, startedAt);
  } catch (error) {
    await saveImportLog({ jobName: "import:filings", status: "failed", recordsCreated, recordsUpdated: 0, message: (error as Error).message }, startedAt);
    throw error;
  }
}
