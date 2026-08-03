import "dotenv/config";
import mariadb from "mariadb";
import { PrismaMariaDb } from "@prisma/adapter-mariadb"; // Keep this as standard import
import clientPkg from "@prisma/client";
const { PrismaClient } = clientPkg; // Only this one needs the workaround
import bcrypt from "bcryptjs";

const conn = await mariadb.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "campusos",
});
console.log("✅ Raw connection works");
await conn.end();

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
  console.log("🧹 Cleaning static data from database...\n");

  // 1. Clean non-superadmin users and dynamic operational data
  await prisma.auditLog.deleteMany().catch(() => {});
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.inventoryRequest.deleteMany().catch(() => {});
  await prisma.leaveRequest.deleteMany().catch(() => {});
  await prisma.complaint.deleteMany().catch(() => {});
  await prisma.allocation.deleteMany().catch(() => {});
  await prisma.bookIssue.deleteMany().catch(() => {});
  await prisma.reservation.deleteMany().catch(() => {});
  await prisma.attendance.deleteMany().catch(() => {});

  await prisma.student.deleteMany().catch(() => {});
  await prisma.warden.deleteMany().catch(() => {});
  await prisma.securityStaff.deleteMany().catch(() => {});

  // Delete all users except superadmin
  const superadminRole = await prisma.role.findUnique({ where: { name: "superadmin" } });
  if (superadminRole) {
    await prisma.user.deleteMany({
      where: {
        NOT: { email: "admin@campusos.com" }
      }
    });
  }

  // Delete all hostels and colleges
  await prisma.hostel.deleteMany().catch(() => {});
  await prisma.college.deleteMany().catch(() => {});

  console.log("✅ Cleaned static colleges, hostels, admins, and students.");

  // 2. Ensure System Roles
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
  }
  console.log("  ✅ System Roles configured");

  // 3. Ensure Permissions
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

  const roleSuperAdmin = await prisma.role.findUnique({ where: { name: "superadmin" } });
  const allPermissions = await prisma.permission.findMany();

  for (const perm of allPermissions) {
    await prisma.rolesOnPermissions.upsert({
      where: {
        roleId_permissionId: {
          roleId: roleSuperAdmin.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: roleSuperAdmin.id,
        permissionId: perm.id,
      },
    });
  }
  console.log("  ✅ System Permissions configured");

  // 4. Ensure Superadmin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Admin@123", salt);

  await prisma.user.upsert({
    where: { email: "admin@campusos.com" },
    update: { password: hashedPassword },
    create: {
      email: "admin@campusos.com",
      password: hashedPassword,
      name: "Super Admin",
      roleId: roleSuperAdmin.id,
      status: "active",
    },
  });
  console.log(`  ✅ Superadmin User active: admin@campusos.com / Admin@123\n`);

  console.log("🎉 Database reset complete! All static data removed.");
}

main()
  .catch((e) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
