import { prisma } from "../lib/prisma";

async function main() {
  const s = await prisma.security.upsert({
    where: { symbol: "CBL" },
    update: {},
    create: {
      symbol: "CBL",
      companyName: "Commonwealth Bank Ltd.",
      sector: "Financials",
      securityType: "Common Stock",
      sourceUrl: "https://bisxbahamas.com"
    }
  });

  await prisma.dailyPrice.createMany({
    data: [
      { securityId: s.id, tradeDate: new Date("2026-03-31"), close: 3.81, previousClose: 3.8, change: 0.01, changePercent: 0.26, volume: 11000, dividendYield: 3.6, sourceUrl: "https://bisxbahamas.com" },
      { securityId: s.id, tradeDate: new Date("2026-04-01"), close: 3.79, previousClose: 3.81, change: -0.02, changePercent: -0.52, volume: 9000, dividendYield: 3.6, sourceUrl: "https://bisxbahamas.com" },
      { securityId: s.id, tradeDate: new Date("2026-04-02"), close: 3.84, previousClose: 3.79, change: 0.05, changePercent: 1.32, volume: 12100, dividendYield: 3.7, sourceUrl: "https://bisxbahamas.com" }
    ],
    skipDuplicates: true
  });

  await prisma.indexDaily.upsert({
    where: { indexName_tradeDate: { indexName: "BISX All-Share Index", tradeDate: new Date("2026-04-02") } },
    update: {},
    create: {
      indexName: "BISX All-Share Index",
      tradeDate: new Date("2026-04-02"),
      close: 2827.44,
      pointChange: 4.29,
      percentChange: 0.15,
      ytdPercent: 2.8,
      sourceUrl: "https://bisxbahamas.com"
    }
  });

  await prisma.newsItem.upsert({
    where: { sourceUrl: "https://bisxbahamas.com/news/cbl-q4-update" },
    update: {},
    create: {
      title: "Commonwealth Bank issues quarterly performance update",
      slug: "cbl-q4-update",
      publishedAt: new Date("2026-04-01"),
      issuerName: "Commonwealth Bank Ltd.",
      securitySymbol: "CBL",
      summary: "The issuer provided a brief update on quarterly performance and strategic priorities.",
      sourceUrl: "https://bisxbahamas.com/news/cbl-q4-update"
    }
  });

  await prisma.filing.upsert({
    where: { sourceUrl: "https://bisxbahamas.com/filings/cbl-annual-report-2025" },
    update: {},
    create: {
      title: "Annual Report 2025",
      filingType: "Annual Report",
      issuerName: "Commonwealth Bank Ltd.",
      securitySymbol: "CBL",
      publishedAt: new Date("2026-03-28"),
      documentUrl: "https://bisxbahamas.com/docs/cbl-annual-report-2025.pdf",
      sourceUrl: "https://bisxbahamas.com/filings/cbl-annual-report-2025"
    }
  });
}

main().finally(() => prisma.$disconnect());
