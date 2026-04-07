import { importNews } from "../src/server/importers/import-news";
import { prisma } from "../lib/prisma";

importNews().finally(() => prisma.$disconnect());
