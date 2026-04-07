import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function NewsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const items: any[] = await prisma.newsItem.findMany({
    where: q ? { OR: [{ title: { contains: q } }, { issuerName: { contains: q } }] } : {},
    orderBy: { publishedAt: "desc" }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">News</h1>
      <form><input name="q" defaultValue={q} placeholder="Search title or issuer" className="w-full rounded border border-line bg-panel p-2 text-sm" /></form>
      {items.length ? items.map((n) => (
        <article key={n.id} className="rounded-xl border border-line bg-panel p-4">
          <Link href={n.sourceUrl} className="font-medium hover:text-accent">{n.title}</Link>
          <p className="mt-1 text-xs text-muted">{n.issuerName ?? "BISX"} · {n.publishedAt.toISOString().slice(0, 10)}</p>
          {n.summary ? <p className="mt-2 text-sm text-muted">{n.summary}</p> : null}
        </article>
      )) : <p className="text-sm text-muted">No news imported yet.</p>}
    </div>
  );
}
