import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

// Parse DATABASE_URL into explicit params for the mariadb driver
function parseDatabaseUrl(url) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname || "localhost",
    port: Number(parsed.port) || 3306,
    user: decodeURIComponent(parsed.username) || "root",
    password: decodeURIComponent(parsed.password) || "",
    database: parsed.pathname.replace("/", "") || "hostel_management",
    connectionLimit: 10,
    allowPublicKeyRetrieval: true,
  };
}

const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb(dbConfig);

export const prisma = new PrismaClient({ adapter });
