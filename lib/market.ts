import { prisma } from "@/lib/prisma";
import { mockDailyPrices, mockFilings, mockIndexDaily, mockNews, mockSecurities } from "@/lib/mock-market-data";

const STALE_DAYS = 7;

type SecurityWithLatest = {
  id: number;
  symbol: string;
  companyName: string;
  sector: string | null;
  securityType: string;
  sourceUrl: string;
  latest?: {
    tradeDate: Date;
    close: number;
    changePercent: number | null;
    volume: number | null;
    dividendYield: number | null;
  };
};

type SecurityWithPrices = {
  id: number;
  symbol: string;
  companyName: string;
  sector: string | null;
  securityType: string;
  sourceUrl: string;
  prices: Array<{
    tradeDate: Date;
    close: number;
    volume: number | null;
    changePercent: number | null;
  }>;
};

export function isStale(date: Date) {
  return Date.now() - date.getTime() > STALE_DAYS * 86400000;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

async function safePrismaQuery<T>(query: () => Promise<T>): Promise<T | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    return await query();
  } catch (error) {
    console.warn("[market] Falling back to mock data because Prisma is unavailable.", error);
    return null;
  }
}

function buildMockSecuritiesWithLatest(): SecurityWithLatest[] {
  return mockSecurities
    .map((s) => {
      const latest = mockDailyPrices
        .filter((p) => p.securityId === s.id)
        .sort((a, b) => b.tradeDate.getTime() - a.tradeDate.getTime())[0];

      return {
        ...s,
        sector: s.sector,
        latest: latest
          ? {
              tradeDate: latest.tradeDate,
              close: latest.close,
              changePercent: latest.changePercent,
              volume: latest.volume,
              dividendYield: latest.dividendYield ?? null
            }
          : undefined
      };
    })
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
}

function getMockSecurityWithPrices(symbol: string): SecurityWithPrices | null {
  const security = mockSecurities.find((item) => item.symbol === symbol.toUpperCase());
  if (!security) return null;

  const prices = mockDailyPrices
    .filter((price) => price.securityId === security.id)
    .sort((a, b) => a.tradeDate.getTime() - b.tradeDate.getTime())
    .map((price) => ({
      tradeDate: price.tradeDate,
      close: price.close,
      volume: price.volume,
      changePercent: price.changePercent
    }));

  return {
    id: security.id,
    symbol: security.symbol,
    companyName: security.companyName,
    sector: security.sector,
    securityType: security.securityType,
    sourceUrl: security.sourceUrl,
    prices
  };
}

export async function getHomepageData() {
  const dbData = await safePrismaQuery(async () => {
    const [latestIndex, latestNews, latestFilings, securities] = await Promise.all([
      prisma.indexDaily.findFirst({ orderBy: { tradeDate: "desc" } }),
      prisma.newsItem.findMany({ orderBy: { publishedAt: "desc" }, take: 5 }),
      prisma.filing.findMany({ orderBy: { publishedAt: "desc" }, take: 5 }),
      prisma.security.findMany({ include: { prices: { orderBy: { tradeDate: "desc" }, take: 1 } } })
    ]);

    return {
      latestIndex,
      latestNews,
      latestFilings,
      securities: securities.map((s) => ({
        id: s.id,
        symbol: s.symbol,
        companyName: s.companyName,
        sector: s.sector,
        securityType: s.securityType,
        sourceUrl: s.sourceUrl,
        latest: s.prices[0]
          ? {
              tradeDate: s.prices[0].tradeDate,
              close: s.prices[0].close,
              changePercent: s.prices[0].changePercent,
              volume: s.prices[0].volume,
              dividendYield: s.prices[0].dividendYield
            }
          : undefined
      }))
    };
  });

  const sourceMode = dbData ? "database" : "fallback";
  const baseSecurities = dbData?.securities ?? buildMockSecuritiesWithLatest();
  const rows = baseSecurities
    .filter((s) => s.latest)
    .sort((a, b) => (b.latest?.changePercent ?? 0) - (a.latest?.changePercent ?? 0));

  return {
    sourceMode,
    latestIndex: dbData?.latestIndex ?? mockIndexDaily[0],
    topGainers: rows.slice(0, 5),
    topDecliners: [...rows].reverse().slice(0, 5),
    mostActive: [...rows].sort((a, b) => (b.latest?.volume ?? 0) - (a.latest?.volume ?? 0)).slice(0, 5),
    highestYield: [...rows]
      .filter((r) => r.latest?.dividendYield)
      .sort((a, b) => (b.latest?.dividendYield ?? 0) - (a.latest?.dividendYield ?? 0))
      .slice(0, 5),
    latestNews: dbData?.latestNews ?? mockNews.slice(0, 5),
    latestFilings: dbData?.latestFilings ?? mockFilings.slice(0, 5)
  };
}

export async function getSecurities(filters: { q?: string; sector?: string; type?: string }) {
  const q = filters.q?.trim().toLowerCase();
  const sector = filters.sector?.trim().toLowerCase();
  const type = filters.type?.trim().toLowerCase();

  const dbItems = await safePrismaQuery(async () => {
    return prisma.security.findMany({
      where: {
        AND: [
          q ? { OR: [{ symbol: { contains: q } }, { companyName: { contains: q } }] } : {},
          sector ? { sector: sector } : {},
          type ? { securityType: type } : {}
        ]
      },
      include: { prices: { orderBy: { tradeDate: "desc" }, take: 1 } },
      orderBy: { symbol: "asc" }
    });
  });

  if (dbItems) {
    return {
      sourceMode: "database" as const,
      items: dbItems.map((s) => ({
        id: s.id,
        symbol: s.symbol,
        companyName: s.companyName,
        sector: s.sector,
        securityType: s.securityType,
        sourceUrl: s.sourceUrl,
        latest: s.prices[0]
          ? {
              tradeDate: s.prices[0].tradeDate,
              close: s.prices[0].close,
              changePercent: s.prices[0].changePercent,
              volume: s.prices[0].volume,
              dividendYield: s.prices[0].dividendYield
            }
          : undefined
      }))
    };
  }

  const fallback = buildMockSecuritiesWithLatest().filter((item) => {
    const matchesQ = !q || item.symbol.toLowerCase().includes(q) || item.companyName.toLowerCase().includes(q);
    const matchesSector = !sector || item.sector?.toLowerCase() === sector;
    const matchesType = !type || item.securityType.toLowerCase() === type;
    return matchesQ && matchesSector && matchesType;
  });

  return { sourceMode: "fallback" as const, items: fallback };
}

export async function getSecurityBySymbol(symbol: string) {
  const normalized = symbol.toUpperCase();

  const dbSecurity = await safePrismaQuery(async () => {
    const security = await prisma.security.findUnique({
      where: { symbol: normalized },
      include: { prices: { orderBy: { tradeDate: "asc" } } }
    });

    if (!security) return null;

    const [news, filings] = await Promise.all([
      prisma.newsItem.findMany({ where: { securitySymbol: security.symbol }, orderBy: { publishedAt: "desc" }, take: 5 }),
      prisma.filing.findMany({ where: { securitySymbol: security.symbol }, orderBy: { publishedAt: "desc" }, take: 5 })
    ]);

    return {
      security: {
        id: security.id,
        symbol: security.symbol,
        companyName: security.companyName,
        sector: security.sector,
        securityType: security.securityType,
        sourceUrl: security.sourceUrl,
        prices: security.prices.map((p) => ({
          tradeDate: p.tradeDate,
          close: p.close,
          volume: p.volume,
          changePercent: p.changePercent
        }))
      },
      news,
      filings
    };
  });

  if (dbSecurity) {
    return { sourceMode: "database" as const, ...dbSecurity };
  }

  const security = getMockSecurityWithPrices(normalized);
  if (!security) return null;

  return {
    sourceMode: "fallback" as const,
    security,
    news: mockNews.filter((n) => n.securitySymbol === security.symbol).slice(0, 5),
    filings: mockFilings.filter((f) => f.securitySymbol === security.symbol).slice(0, 5)
  };
}

export async function getNews(q?: string) {
  const query = q?.trim().toLowerCase();

  const dbItems = await safePrismaQuery(async () => {
    return prisma.newsItem.findMany({
      where: query ? { OR: [{ title: { contains: query } }, { issuerName: { contains: query } }] } : {},
      orderBy: { publishedAt: "desc" }
    });
  });

  if (dbItems) return { sourceMode: "database" as const, items: dbItems };

  const filtered = mockNews
    .filter((n) => !query || n.title.toLowerCase().includes(query) || n.issuerName?.toLowerCase().includes(query))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return { sourceMode: "fallback" as const, items: filtered };
}

export async function getFilings(q?: string) {
  const query = q?.trim().toLowerCase();

  const dbItems = await safePrismaQuery(async () => {
    return prisma.filing.findMany({
      where: query ? { OR: [{ title: { contains: query } }, { issuerName: { contains: query } }, { filingType: { contains: query } }] } : {},
      orderBy: { publishedAt: "desc" }
    });
  });

  if (dbItems) return { sourceMode: "database" as const, items: dbItems };

  const filtered = mockFilings
    .filter((f) => !query || f.title.toLowerCase().includes(query) || f.issuerName?.toLowerCase().includes(query) || f.filingType.toLowerCase().includes(query))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return { sourceMode: "fallback" as const, items: filtered };
}
