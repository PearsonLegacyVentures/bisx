import { importSecurities } from "./import-securities";
import { importPrices } from "./import-prices";
import { importNews } from "./import-news";
import { importFilings } from "./import-filings";

export async function importAll() {
  const tasks = [importSecurities, importPrices, importNews, importFilings];
  for (const task of tasks) {
    try {
      await task();
      console.log(`✅ ${task.name} finished`);
    } catch (error) {
      console.error(`❌ ${task.name} failed`, error);
    }
  }
}
