import { getNews } from "@/lib/market";

export default async function NewsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const { items, sourceMode } = await getNews(q);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">News</h1>
      {sourceMode === "fallback" ? <p className="text-xs text-muted">Showing sample records while database mode is unavailable.</p> : null}
      <form><input name="q" defaultValue={q} placeholder="Search title or issuer" className="w-full rounded border border-line bg-panel p-2 text-sm" /></form>
      {items.length ? items.map((n) => (
        <article key={n.id} className="rounded-xl border border-line bg-panel p-4">
          <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-accent">{n.title}</a>
          <p className="mt-1 text-xs text-muted">{n.issuerName ?? "BISX"} · {n.publishedAt.toISOString().slice(0, 10)}</p>
          {n.summary ? <p className="mt-2 text-sm text-muted">{n.summary}</p> : null}
        </article>
      )) : <p className="text-sm text-muted">No news imported yet.</p>}
    </div>
  );
}
