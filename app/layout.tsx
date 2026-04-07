import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BISX Pulse",
  description: "Public market intelligence dashboard for BISX securities."
};

const nav = [
  ["Dashboard", "/"],
  ["Securities", "/securities"],
  ["News", "/news"],
  ["Filings", "/filings"],
  ["Methodology", "/methodology"]
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-line bg-bg/95 backdrop-blur">
          <div className="container-shell flex items-center justify-between py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">BISX Pulse</Link>
            <nav className="flex gap-4 text-sm text-muted">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="hover:text-text transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="container-shell py-8">{children}</main>
      </body>
    </html>
  );
}
