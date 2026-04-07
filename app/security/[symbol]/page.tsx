import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { LineChart } from "@/components/charts/line-chart";
import { isStale } from "@/lib/market";

export default async function SecurityPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const security = await prisma.security.findUnique({
    where: { symbol: symbol.toUpperCase() },
    include: { prices: { orderBy: { tradeDate: "asc" } } }
  });
  if (!security) return notFound();

  const latest = security.prices.at(-1);
  const news = await prisma.newsItem.findMany({ where: { securitySymbol: security.symbol }, orderBy: { publishedAt: "desc" }, take: 5 });
  const filings = await prisma.filing.findMany({ where: { securitySymbol: security.symbol }, orderBy: { publishedAt: "desc" }, take: 5 });

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs text-muted">{security.securityType} · {security.sector ?? "Sector not set"}</p>
        <h1 className="text-3xl font-semibold">{security.symbol} — {security.companyName}</h1>
      </header>
      <Card title="Latest quote">
        {latest ? (
          <div className="grid gap-3 sm:grid-cols-4 text-sm">
            <div><p className="text-muted">Latest available close</p><p className="text-xl font-semibold">{latest.close.toFixed(2)}</p></div>
            <div><p className="text-muted">Daily change</p><p className={(latest.changePercent ?? 0) >= 0 ? "text-success" : "text-danger"}>{latest.changePercent?.toFixed(2) ?? "—"}%</p></div>
            <div><p className="text-muted">Volume</p><p>{latest.volume?.toLocaleString() ?? "—"}</p></div>
            <div><p className="text-muted">Trading status</p><p>{isStale(latest.tradeDate) ? "Thinly traded / stale" : "Current"}</p></div>
          </div>
        ) : <p className="text-muted">No price data available.</p>}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Closing Price History">
          {security.prices.length ? <LineChart label="Closing Price History" data={security.prices.map((p) => ({ time: p.tradeDate.toISOString().slice(0, 10), value: p.close }))} /> : <p className="text-sm text-muted">No chart data imported yet.</p>}
        </Card>
        <Card title="Volume History">
          {security.prices.some((p) => p.volume) ? <LineChart label="Volume History" data={security.prices.map((p) => ({ time: p.tradeDate.toISOString().slice(0, 10), value: p.volume ?? 0 }))} /> : <p className="text-sm text-muted">Volume history unavailable.</p>}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Recent news">{news.length ? news.map((n) => <a key={n.id} href={n.sourceUrl} target="_blank" rel="noopener noreferrer" className="mb-2 block text-sm hover:text-accent">{n.title}</a>) : <p className="text-sm text-muted">No issuer news currently indexed.</p>}</Card>
        <Card title="Recent filings">{filings.length ? filings.map((f) => <a key={f.id} href={f.documentUrl} target="_blank" rel="noopener noreferrer" className="mb-2 block text-sm hover:text-accent">{f.title}</a>) : <p className="text-sm text-muted">No issuer filings currently indexed.</p>}</Card>
      </div>

      <Card title="Source attribution">
        <p className="text-sm text-muted">Primary source: <a className="text-accent" href={security.sourceUrl} target="_blank" rel="noopener noreferrer">{security.sourceUrl}</a></p>
        <p className="mt-2 text-xs text-muted">This dashboard is informational only and is not investment advice.</p>
      </Card>
    </div>
  );
}
