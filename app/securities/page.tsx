import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isStale } from "@/lib/market";

export default async function SecuritiesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const sector = typeof sp.sector === "string" ? sp.sector : "";
  const type = typeof sp.type === "string" ? sp.type : "";

  const items = await prisma.security.findMany({
    where: {
      AND: [
        q ? { OR: [{ symbol: { contains: q } }, { companyName: { contains: q } }] } : {},
        sector ? { sector } : {},
        type ? { securityType: type } : {}
      ]
    },
    include: { prices: { orderBy: { tradeDate: "desc" }, take: 1 } },
    orderBy: { symbol: "asc" }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Securities Directory</h1>
      <form className="grid gap-2 md:grid-cols-4">
        <input name="q" defaultValue={q} placeholder="Symbol or company" className="rounded border border-line bg-panel p-2 text-sm" />
        <input name="sector" defaultValue={sector} placeholder="Sector" className="rounded border border-line bg-panel p-2 text-sm" />
        <input name="type" defaultValue={type} placeholder="Security type" className="rounded border border-line bg-panel p-2 text-sm" />
        <button className="rounded bg-accent px-3 py-2 text-sm font-medium text-black">Apply filters</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="min-w-full text-sm">
          <thead className="bg-panel text-left text-muted"><tr><th className="p-3">Symbol</th><th>Company</th><th>Sector</th><th>Type</th><th>Latest close</th><th>Daily change</th><th>Volume</th><th>Status</th></tr></thead>
          <tbody>
            {items.map((s) => {
              const latest = s.prices[0];
              return (
                <tr key={s.id} className="border-t border-line">
                  <td className="p-3"><Link href={`/security/${s.symbol}`} className="font-semibold hover:text-accent">{s.symbol}</Link></td>
                  <td>{s.companyName}</td><td>{s.sector ?? "—"}</td><td>{s.securityType}</td>
                  <td>{latest?.close.toFixed(2) ?? "—"}</td>
                  <td className={(latest?.changePercent ?? 0) >= 0 ? "text-success" : "text-danger"}>{latest?.changePercent?.toFixed(2) ?? "—"}%</td>
                  <td>{latest?.volume?.toLocaleString() ?? "—"}</td>
                  <td>{latest && isStale(latest.tradeDate) ? "Stale" : "Fresh"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
