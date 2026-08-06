import "dotenv/config";
import mariadb from "mariadb";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import clientPkg from "@prisma/client";
const { PrismaClient } = clientPkg;

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "campusos",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const role = await prisma.role.upsert({
    where: { name: "senioradmin" },
    update: {},
    create: { name: "senioradmin", description: "Senior Administrator who manages Admins" }
  });
  
  await prisma.user.updateMany({
    where: { email: "vppadmin@pvppcoe.ac.in" },
    data: { roleId: role.id }
  });
  console.log("Created senioradmin role and updated user!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
