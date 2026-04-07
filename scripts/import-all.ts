import { importAll } from "../src/server/importers/import-all";
import { prisma } from "../lib/prisma";

importAll().finally(() => prisma.$disconnect());
