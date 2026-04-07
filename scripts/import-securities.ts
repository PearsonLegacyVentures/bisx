import { importSecurities } from "../src/server/importers/import-securities";
import { prisma } from "../lib/prisma";

importSecurities().finally(() => prisma.$disconnect());
