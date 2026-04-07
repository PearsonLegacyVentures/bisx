import * as cheerio from "cheerio";

export async function fetchHtml(url: string) {
  const res = await fetch(url, { headers: { "user-agent": "BISX Pulse Importer" } });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const html = await res.text();
  return cheerio.load(html);
}

export function normalizeTitle(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}
