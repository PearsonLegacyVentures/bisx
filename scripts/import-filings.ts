import { importFilings } from "../src/server/importers/import-filings";
import { prisma } from "../lib/prisma";

importFilings().finally(() => prisma.$disconnect());
