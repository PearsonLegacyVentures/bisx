import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getDashboardData, isStale } from "@/lib/market";

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-line bg-gradient-to-b from-panel to-bg p-6">
        <p className="text-xs uppercase tracking-widest text-muted">Bahamas International Securities Exchange</p>
        <h1 className="mt-2 text-3xl font-semibold">BISX Pulse</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          A public market intelligence dashboard focused on clarity. Track latest available close prices,
          filings, and issuer updates from BISX sources.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Latest index summary">
          {data.latestIndex ? (
            <div className="space-y-1 text-sm">
              <p>{data.latestIndex.indexName}</p>
              <p className="text-xl font-semibold">{data.latestIndex.close.toFixed(2)}</p>
              <p className="text-muted">YTD: {data.latestIndex.ytdPercent?.toFixed(2)}%</p>
            </div>
          ) : (
            <p className="text-sm text-muted">No index records imported yet.</p>
          )}
        </Card>
        <Card title="Market Snapshot">
          <p className="text-sm text-muted">
            Today&apos;s board shows selective activity. Use stale-data flags to identify thinly traded securities before comparing moves.
          </p>
        </Card>
        <Card title="Top gainers">{data.topGainers.map((x) => <Ticker key={x.symbol} symbol={x.symbol} change={x.latest!.changePercent ?? 0} />)}</Card>
        <Card title="Top decliners">{data.topDecliners.map((x) => <Ticker key={x.symbol} symbol={x.symbol} change={x.latest!.changePercent ?? 0} />)}</Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Most active by volume">{data.mostActive.map((x) => <Row key={x.symbol} label={x.symbol} value={`${x.latest?.volume ?? 0} shares`} />)}</Card>
        <Card title="Highest dividend yield">{data.highestYield.length ? data.highestYield.map((x) => <Row key={x.symbol} label={x.symbol} value={`${x.latest?.dividendYield?.toFixed(2)}%`} />) : <p className="text-sm text-muted">Yield data not available yet.</p>}</Card>
        <Card title="Low-activity / stale flags">
          {data.mostActive.filter((x) => x.latest && isStale(x.latest.tradeDate)).length ? (
            data.mostActive.filter((x) => x.latest && isStale(x.latest.tradeDate)).map((x) => (
              <Row key={x.symbol} label={x.symbol} value="Stale price history" />
            ))
          ) : (
            <p className="text-sm text-muted">No stale flags in top active set.</p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Latest company news">
          {data.latestNews.map((n) => (
            <Link key={n.id} href={n.sourceUrl} className="mb-3 block text-sm hover:text-accent">
              {n.title}
            </Link>
          ))}
        </Card>
        <Card title="Latest filings / reports">
          {data.latestFilings.map((f) => (
            <Link key={f.id} href={f.documentUrl} className="mb-3 block text-sm hover:text-accent">
              {f.title}
            </Link>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Ticker({ symbol, change }: { symbol: string; change: number }) {
  return <p className="mb-2 text-sm"><span className="font-semibold">{symbol}</span> <span className={change >= 0 ? "text-success" : "text-danger"}>{change.toFixed(2)}%</span></p>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <p className="mb-2 flex justify-between text-sm"><span>{label}</span><span className="text-muted">{value}</span></p>;
}
