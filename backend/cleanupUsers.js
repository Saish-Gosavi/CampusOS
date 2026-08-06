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
  const users = await prisma.user.findMany({ include: { role: true } });
  console.log("Current users:");
  users.forEach(u => console.log(u.email, "->", u.role?.name));

  console.log("\\nDeleting unnecessary admins...");
  
  // Find roles we want to keep
  const keepRoles = ["superadmin", "senioradmin"];
  
  // Delete users whose role is not in keepRoles
  const result = await prisma.user.deleteMany({
    where: {
      role: {
        name: {
          notIn: keepRoles
        }
      }
    }
  });

  console.log(`Deleted ${result.count} unnecessary admin/user accounts.`);
  
  const remaining = await prisma.user.findMany({ include: { role: true } });
  console.log("\\nRemaining users:");
  remaining.forEach(u => console.log(u.email, "->", u.role?.name));
}

main().catch(console.error).finally(() => prisma.$disconnect());
