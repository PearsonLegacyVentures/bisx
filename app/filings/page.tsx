import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function FilingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const items: any[] = await prisma.filing.findMany({
    where: q ? { OR: [{ title: { contains: q } }, { issuerName: { contains: q } }, { filingType: { contains: q } }] } : {},
    orderBy: { publishedAt: "desc" }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Filings & Reports</h1>
      <form><input name="q" defaultValue={q} placeholder="Search filing title, issuer, type" className="w-full rounded border border-line bg-panel p-2 text-sm" /></form>
      {items.length ? items.map((f) => (
        <article key={f.id} className="rounded-xl border border-line bg-panel p-4">
          <Link href={f.documentUrl} className="font-medium hover:text-accent">{f.title}</Link>
          <p className="mt-1 text-xs text-muted">{f.filingType} · {f.issuerName ?? "BISX"} · {f.publishedAt.toISOString().slice(0, 10)}</p>
          <Link href={f.sourceUrl} className="mt-2 block text-xs text-accent">Source page</Link>
        </article>
      )) : <p className="text-sm text-muted">No filings imported yet.</p>}
    </div>
  );
}
