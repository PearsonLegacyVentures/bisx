export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-panel p-4 sm:p-5">
      {title ? <h2 className="mb-3 text-sm font-semibold text-muted">{title}</h2> : null}
      {children}
    </section>
  );
}
