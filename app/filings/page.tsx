import { getFilings } from "@/lib/market";

export default async function FilingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const { items, sourceMode } = await getFilings(q);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Filings & Reports</h1>
      {sourceMode === "fallback" ? <p className="text-xs text-muted">Showing sample records while database mode is unavailable.</p> : null}
      <form><input name="q" defaultValue={q} placeholder="Search filing title, issuer, type" className="w-full rounded border border-line bg-panel p-2 text-sm" /></form>
      {items.length ? items.map((f) => (
        <article key={f.id} className="rounded-xl border border-line bg-panel p-4">
          <a href={f.documentUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-accent">{f.title}</a>
          <p className="mt-1 text-xs text-muted">{f.filingType} · {f.issuerName ?? "BISX"} · {f.publishedAt.toISOString().slice(0, 10)}</p>
          <a href={f.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-xs text-accent">Source page</a>
        </article>
      )) : <p className="text-sm text-muted">No filings imported yet.</p>}
    </div>
  );
}
