import { prisma } from "../lib/prisma";

const SOURCE_URL = "https://bisxbahamas.com";

async function seedSecurities() {
  return prisma.security.upsert({
    where: { symbol: "CBL" },
    update: {
      companyName: "Commonwealth Bank Ltd.",
      sector: "Financials",
      securityType: "Common Stock",
      isActive: true,
      sourceUrl: SOURCE_URL
    },
    create: {
      symbol: "CBL",
      companyName: "Commonwealth Bank Ltd.",
      sector: "Financials",
      securityType: "Common Stock",
      isActive: true,
      sourceUrl: SOURCE_URL
    }
  });
}

async function seedDailyPrices(securityId: number) {
  const prices = [
    {
      tradeDate: new Date("2026-03-31"),
      close: 3.81,
      previousClose: 3.8,
      change: 0.01,
      changePercent: 0.26,
      volume: 11000,
      dividendYield: 3.6
    },
    {
      tradeDate: new Date("2026-04-01"),
      close: 3.79,
      previousClose: 3.81,
      change: -0.02,
      changePercent: -0.52,
      volume: 9000,
      dividendYield: 3.6
    },
    {
      tradeDate: new Date("2026-04-02"),
      close: 3.84,
      previousClose: 3.79,
      change: 0.05,
      changePercent: 1.32,
      volume: 12100,
      dividendYield: 3.7
    }
  ] as const;

  for (const price of prices) {
    await prisma.dailyPrice.upsert({
      where: {
        securityId_tradeDate: {
          securityId,
          tradeDate: price.tradeDate
        }
      },
      update: {
        close: price.close,
        previousClose: price.previousClose,
        change: price.change,
        changePercent: price.changePercent,
        volume: price.volume,
        dividendYield: price.dividendYield,
        sourceUrl: SOURCE_URL
      },
      create: {
        securityId,
        tradeDate: price.tradeDate,
        close: price.close,
        previousClose: price.previousClose,
        change: price.change,
        changePercent: price.changePercent,
        volume: price.volume,
        dividendYield: price.dividendYield,
        sourceUrl: SOURCE_URL
      }
    });
  }
}

async function seedIndexData() {
  await prisma.indexDaily.upsert({
    where: {
      indexName_tradeDate: {
        indexName: "BISX All-Share Index",
        tradeDate: new Date("2026-04-02")
      }
    },
    update: {
      close: 2827.44,
      pointChange: 4.29,
      percentChange: 0.15,
      ytdPercent: 2.8,
      sourceUrl: SOURCE_URL
    },
    create: {
      indexName: "BISX All-Share Index",
      tradeDate: new Date("2026-04-02"),
      close: 2827.44,
      pointChange: 4.29,
      percentChange: 0.15,
      ytdPercent: 2.8,
      sourceUrl: SOURCE_URL
    }
  });
}

async function seedNews() {
  await prisma.newsItem.upsert({
    where: { sourceUrl: `${SOURCE_URL}/news/cbl-q4-update` },
    update: {
      title: "Commonwealth Bank issues quarterly performance update",
      slug: "cbl-q4-update",
      publishedAt: new Date("2026-04-01"),
      issuerName: "Commonwealth Bank Ltd.",
      securitySymbol: "CBL",
      summary:
        "The issuer provided a brief update on quarterly performance and strategic priorities."
    },
    create: {
      title: "Commonwealth Bank issues quarterly performance update",
      slug: "cbl-q4-update",
      publishedAt: new Date("2026-04-01"),
      issuerName: "Commonwealth Bank Ltd.",
      securitySymbol: "CBL",
      summary:
        "The issuer provided a brief update on quarterly performance and strategic priorities.",
      sourceUrl: `${SOURCE_URL}/news/cbl-q4-update`
    }
  });
}

async function seedFilings() {
  await prisma.filing.upsert({
    where: { sourceUrl: `${SOURCE_URL}/filings/cbl-annual-report-2025` },
    update: {
      title: "Annual Report 2025",
      filingType: "Annual Report",
      issuerName: "Commonwealth Bank Ltd.",
      securitySymbol: "CBL",
      publishedAt: new Date("2026-03-28"),
      documentUrl: `${SOURCE_URL}/docs/cbl-annual-report-2025.pdf`
    },
    create: {
      title: "Annual Report 2025",
      filingType: "Annual Report",
      issuerName: "Commonwealth Bank Ltd.",
      securitySymbol: "CBL",
      publishedAt: new Date("2026-03-28"),
      documentUrl: `${SOURCE_URL}/docs/cbl-annual-report-2025.pdf`,
      sourceUrl: `${SOURCE_URL}/filings/cbl-annual-report-2025`
    }
  });
}

async function main() {
  const security = await seedSecurities();

  await seedDailyPrices(security.id);
  await seedIndexData();
  await seedNews();
  await seedFilings();
}

main().finally(() => prisma.$disconnect());
