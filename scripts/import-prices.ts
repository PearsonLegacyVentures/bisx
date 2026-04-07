import { importPrices } from "../src/server/importers/import-prices";
import { prisma } from "../lib/prisma";

importPrices().finally(() => prisma.$disconnect());
