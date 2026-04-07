import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { saveImportLog } from "./logging";

const SecuritySchema = z.object({
  symbol: z.string().min(1),
  companyName: z.string().min(1),
  sector: z.string().optional(),
  securityType: z.string().min(1),
  sourceUrl: z.string().url()
});

export async function importSecurities() {
  const startedAt = new Date();
  let recordsCreated = 0;
  let recordsUpdated = 0;
  try {
    const parsed = [
      { symbol: "CBL", companyName: "Commonwealth Bank Ltd.", sector: "Financials", securityType: "Common Stock", sourceUrl: "https://bisxbahamas.com" },
      { symbol: "FCL", companyName: "FOCOL Holdings Ltd.", sector: "Energy", securityType: "Common Stock", sourceUrl: "https://bisxbahamas.com" }
    ].map((item) => SecuritySchema.parse(item));

    for (const row of parsed) {
      const existing = await prisma.security.findUnique({ where: { symbol: row.symbol } });
      await prisma.security.upsert({ where: { symbol: row.symbol }, update: row, create: row });
      if (existing) recordsUpdated += 1; else recordsCreated += 1;
    }

    await saveImportLog({ jobName: "import:securities", status: "success", recordsCreated, recordsUpdated }, startedAt);
  } catch (error) {
    await saveImportLog({ jobName: "import:securities", status: "failed", recordsCreated, recordsUpdated, message: (error as Error).message }, startedAt);
    throw error;
  }
}
