export default function MethodologyPage() {
  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-semibold">Methodology</h1>
      <p className="text-sm text-muted">BISX Pulse aggregates public information from BISX pages and issuer disclosures. Each record stores its source URL and import timestamp.</p>
      <p className="text-sm text-muted">Charts are based on closing prices unless otherwise stated. We do not render OHLC candlesticks in this MVP because verified OHLC data is not consistently available.</p>
      <p className="text-sm text-muted">Data updates run on scheduled weekday imports after market close and can be triggered manually.</p>
      <p className="text-sm text-muted">Source attribution is shown in security pages and record links across news and filings.</p>
      <p className="text-sm text-muted">BISX Pulse is informational only and does not provide investment advice.</p>
    </div>
  );
}
