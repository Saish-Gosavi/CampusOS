import "dotenv/config";
import mariadb from "mariadb";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Test raw connection first
const conn = await mariadb.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "campusos",
});
console.log("✅ Raw connection works");
await conn.end();

// Setup Prisma with PrismaMariaDb adapter
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
  console.log("🌱 Database seeding started...\n");

  // 1. Create Roles
  const roles = [
    { name: "superadmin", description: "Super Administrator with full access" },
    { name: "admin", description: "Hostel Administrator" },
    { name: "warden", description: "Hostel Warden" },
    { name: "student", description: "Hostel Student" },
    { name: "security", description: "Security Staff" },
    { name: "librarian", description: "Library Manager" },
    { name: "store", description: "Inventory/Store Manager" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    console.log(`  ✅ Role: ${role.name}`);
  }

  // 2. Create Permissions
  const permissions = [
    { name: "users:read", description: "View users" },
    { name: "users:write", description: "Create/update users" },
    { name: "users:delete", description: "Delete users" },
    { name: "hostels:read", description: "View hostels" },
    { name: "hostels:write", description: "Create/update hostels" },
    { name: "hostels:delete", description: "Delete hostels" },
    { name: "rooms:read", description: "View rooms" },
    { name: "rooms:write", description: "Create/update rooms" },
    { name: "allocations:read", description: "View allocations" },
    { name: "allocations:write", description: "Create/update allocations" },
    { name: "complaints:read", description: "View complaints" },
    { name: "complaints:write", description: "Create/update complaints" },
    { name: "leaves:read", description: "View leave requests" },
    { name: "leaves:write", description: "Create/update leave requests" },
    { name: "visitors:read", description: "View visitors" },
    { name: "visitors:write", description: "Create/update visitors" },
    { name: "fees:read", description: "View fees" },
    { name: "fees:write", description: "Manage fees" },
    { name: "library:read", description: "View library" },
    { name: "library:write", description: "Manage library" },
    { name: "inventory:read", description: "View inventory" },
    { name: "inventory:write", description: "Manage inventory" },
    { name: "reports:read", description: "View reports" },
    { name: "dashboard:read", description: "View dashboard" },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }
  console.log(`  ✅ Permissions: ${permissions.length} created\n`);

  // 3. Assign all permissions to superadmin role
  const superadminRole = await prisma.role.findUnique({ where: { name: "superadmin" } });
  const allPermissions = await prisma.permission.findMany();

  for (const perm of allPermissions) {
    await prisma.rolesOnPermissions.upsert({
      where: {
        roleId_permissionId: {
          roleId: superadminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: superadminRole.id,
        permissionId: perm.id,
      },
    });
  }
  console.log(`  ✅ All permissions assigned to superadmin\n`);

  // 4. Create Superadmin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Admin@123", salt);

  await prisma.user.upsert({
    where: { email: "admin@campusos.com" },
    update: {},
    create: {
      email: "admin@campusos.com",
      password: hashedPassword,
      name: "Super Admin",
      roleId: superadminRole.id,
      status: "active",
    },
  });
  console.log(`  ✅ Superadmin user created:`);
  console.log(`     Email:    admin@campusos.com`);
  console.log(`     Password: Admin@123`);
  console.log(`     Role:     superadmin\n`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
