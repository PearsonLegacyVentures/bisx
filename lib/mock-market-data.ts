export type MockSecurity = {
  id: number;
  symbol: string;
  companyName: string;
  sector: string;
  securityType: string;
  isActive: boolean;
  sourceUrl: string;
};

export type MockDailyPrice = {
  id: number;
  securityId: number;
  tradeDate: Date;
  close: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  dividendYield?: number;
  sourceUrl: string;
};

export type MockIndexDaily = {
  id: number;
  tradeDate: Date;
  indexName: string;
  close: number;
  pointChange: number;
  percentChange: number;
  ytdPercent: number;
  sourceUrl: string;
};

export type MockNewsItem = {
  id: number;
  title: string;
  slug: string;
  publishedAt: Date;
  issuerName?: string;
  securitySymbol?: string;
  summary?: string;
  sourceUrl: string;
};

export type MockFiling = {
  id: number;
  title: string;
  filingType: string;
  issuerName?: string;
  securitySymbol?: string;
  publishedAt: Date;
  documentUrl: string;
  sourceUrl: string;
};

export const mockSecurities: MockSecurity[] = [
  { id: 1, symbol: "CBL", companyName: "Commonwealth Bank Ltd.", sector: "Financials", securityType: "Common Stock", isActive: true, sourceUrl: "https://bisxbahamas.com" },
  { id: 2, symbol: "FBB", companyName: "Fidelity Bank (Bahamas) Ltd.", sector: "Financials", securityType: "Common Stock", isActive: true, sourceUrl: "https://bisxbahamas.com" },
  { id: 3, symbol: "CHL", companyName: "Cable Bahamas Ltd.", sector: "Communications", securityType: "Common Stock", isActive: true, sourceUrl: "https://bisxbahamas.com" },
  { id: 4, symbol: "AML", companyName: "AML Foods Ltd.", sector: "Consumer Staples", securityType: "Common Stock", isActive: true, sourceUrl: "https://bisxbahamas.com" },
  { id: 5, symbol: "DHS", companyName: "Doctors Hospital Health System", sector: "Healthcare", securityType: "Common Stock", isActive: true, sourceUrl: "https://bisxbahamas.com" }
];

export const mockDailyPrices: MockDailyPrice[] = [
  { id: 1, securityId: 1, tradeDate: new Date("2026-04-02"), close: 3.84, previousClose: 3.79, change: 0.05, changePercent: 1.32, volume: 12100, dividendYield: 3.7, sourceUrl: "https://bisxbahamas.com" },
  { id: 2, securityId: 2, tradeDate: new Date("2026-04-02"), close: 2.76, previousClose: 2.8, change: -0.04, changePercent: -1.43, volume: 6800, dividendYield: 2.9, sourceUrl: "https://bisxbahamas.com" },
  { id: 3, securityId: 3, tradeDate: new Date("2026-04-02"), close: 2.05, previousClose: 2.02, change: 0.03, changePercent: 1.49, volume: 35400, dividendYield: 4.2, sourceUrl: "https://bisxbahamas.com" },
  { id: 4, securityId: 4, tradeDate: new Date("2026-04-01"), close: 1.43, previousClose: 1.44, change: -0.01, changePercent: -0.69, volume: 2400, dividendYield: 2.2, sourceUrl: "https://bisxbahamas.com" },
  { id: 5, securityId: 5, tradeDate: new Date("2026-03-25"), close: 6.32, previousClose: 6.32, change: 0, changePercent: 0, volume: 900, dividendYield: 1.1, sourceUrl: "https://bisxbahamas.com" }
];

export const mockIndexDaily: MockIndexDaily[] = [
  { id: 1, indexName: "BISX All-Share Index", tradeDate: new Date("2026-04-02"), close: 2827.44, pointChange: 4.29, percentChange: 0.15, ytdPercent: 2.8, sourceUrl: "https://bisxbahamas.com" }
];

export const mockNews: MockNewsItem[] = [
  { id: 1, title: "Commonwealth Bank issues quarterly performance update", slug: "cbl-q4-update", publishedAt: new Date("2026-04-01"), issuerName: "Commonwealth Bank Ltd.", securitySymbol: "CBL", summary: "The issuer shared a quarterly update covering lending activity and portfolio quality.", sourceUrl: "https://bisxbahamas.com/news/cbl-q4-update" },
  { id: 2, title: "Cable Bahamas releases network expansion briefing", slug: "chl-network-expansion-briefing", publishedAt: new Date("2026-03-30"), issuerName: "Cable Bahamas Ltd.", securitySymbol: "CHL", summary: "Management outlined expansion milestones and service reliability targets for 2026.", sourceUrl: "https://bisxbahamas.com/news/chl-network-expansion-briefing" },
  { id: 3, title: "AML Foods confirms store format refresh schedule", slug: "aml-store-format-refresh", publishedAt: new Date("2026-03-27"), issuerName: "AML Foods Ltd.", securitySymbol: "AML", summary: "The company confirmed phased upgrades across key retail locations.", sourceUrl: "https://bisxbahamas.com/news/aml-store-format-refresh" }
];

export const mockFilings: MockFiling[] = [
  { id: 1, title: "Annual Report 2025", filingType: "Annual Report", issuerName: "Commonwealth Bank Ltd.", securitySymbol: "CBL", publishedAt: new Date("2026-03-28"), documentUrl: "https://bisxbahamas.com/docs/cbl-annual-report-2025.pdf", sourceUrl: "https://bisxbahamas.com/filings/cbl-annual-report-2025" },
  { id: 2, title: "Q1 Financial Statements", filingType: "Quarterly Financials", issuerName: "Cable Bahamas Ltd.", securitySymbol: "CHL", publishedAt: new Date("2026-03-26"), documentUrl: "https://bisxbahamas.com/docs/chl-q1-financial-statements.pdf", sourceUrl: "https://bisxbahamas.com/filings/chl-q1-financial-statements" },
  { id: 3, title: "Dividend Notice", filingType: "Dividend Notice", issuerName: "Fidelity Bank (Bahamas) Ltd.", securitySymbol: "FBB", publishedAt: new Date("2026-03-20"), documentUrl: "https://bisxbahamas.com/docs/fbb-dividend-notice.pdf", sourceUrl: "https://bisxbahamas.com/filings/fbb-dividend-notice" }
];
