import { prisma } from "@/lib/prisma";

const STALE_DAYS = 7;

export function isStale(date: Date) {
  return Date.now() - date.getTime() > STALE_DAYS * 86400000;
}

export async function getDashboardData() {
  const [latestIndex, latestNews, latestFilings, securities] = await Promise.all([
    prisma.indexDaily.findFirst({ orderBy: { tradeDate: "desc" } }),
    prisma.newsItem.findMany({ orderBy: { publishedAt: "desc" }, take: 5 }),
    prisma.filing.findMany({ orderBy: { publishedAt: "desc" }, take: 5 }),
    prisma.security.findMany({ include: { prices: { orderBy: { tradeDate: "desc" }, take: 1 } } })
  ]);

  const rows = securities
    .map((s) => ({ ...s, latest: s.prices[0] }))
    .filter((s) => s.latest)
    .sort((a, b) => (b.latest?.changePercent ?? 0) - (a.latest?.changePercent ?? 0));

  return {
    latestIndex,
    topGainers: rows.slice(0, 5),
    topDecliners: [...rows].reverse().slice(0, 5),
    mostActive: [...rows].sort((a, b) => (b.latest?.volume ?? 0) - (a.latest?.volume ?? 0)).slice(0, 5),
    highestYield: [...rows]
      .filter((r) => r.latest?.dividendYield)
      .sort((a, b) => (b.latest?.dividendYield ?? 0) - (a.latest?.dividendYield ?? 0))
      .slice(0, 5),
    latestNews,
    latestFilings
  };
}
