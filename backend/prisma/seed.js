import "dotenv/config";
import mariadb from "mariadb";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const conn = await mariadb.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "campusos",
  allowPublicKeyRetrieval: true,
});
console.log("✅ Raw connection works");
await conn.end();

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "campusos",
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
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

  const roleMap = {};
  for (const role of roles) {
    const r = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    roleMap[role.name] = r.id;
    console.log(`  ✅ Role: ${role.name}`);
  }

  // 2. Create Hostels / Colleges
  const hostelsData = [
    { name: "VPPCOE Campus", city: "Mumbai", address: "Sion, Mumbai, Maharashtra", status: "Active" },
    { name: "Nova Institute of Technology", city: "Pune", address: "Hinjawadi, Pune, Maharashtra", status: "Active" },
    { name: "Meridian College", city: "Delhi", address: "Dwarka, New Delhi", status: "Active" },
    { name: "Aurora Tech Institute", city: "Bengaluru", address: "Electronic City, Bengaluru", status: "Active" },
    { name: "Zenith University", city: "Hyderabad", address: "Gachibowli, Hyderabad", status: "Active" }
  ];

  const hostelMap = {};
  for (const h of hostelsData) {
    const hostel = await prisma.hostel.upsert({
      where: { name: h.name },
      update: { city: h.city, address: h.address },
      create: h,
    });
    hostelMap[h.name] = hostel.id;
    console.log(`  ✅ Hostel/College: ${h.name} (${h.city})`);
  }

  // 3. Create Superadmin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Admin@123", salt);

  const superAdminUser = await prisma.user.upsert({
    where: { email: "admin@campusos.com" },
    update: { password: hashedPassword },
    create: {
      email: "admin@campusos.com",
      password: hashedPassword,
      name: "Super Admin",
      roleId: roleMap["superadmin"],
      status: "active",
    },
  });
  console.log(`  ✅ Superadmin created: admin@campusos.com`);

  // 4. Create Staff / Admins / Wardens
  const adminsData = [
    { name: "Rahul Sharma", email: "rahul.sharma@vppcoe.edu.in", role: "admin", hostel: "VPPCOE Campus" },
    { name: "Priya Menon", email: "priya.menon@vppcoe.edu.in", role: "librarian", hostel: "VPPCOE Campus" },
    { name: "Arjun Iyer", email: "arjun.iyer@nova.edu.in", role: "store", hostel: "Nova Institute of Technology" },
    { name: "Neha Kulkarni", email: "neha.k@meridian.edu.in", role: "warden", hostel: "Meridian College" },
    { name: "Vikram Shetty", email: "vikram.s@aurora.edu.in", role: "librarian", hostel: "Aurora Tech Institute" },
    { name: "Sanya Kapoor", email: "sanya.k@vppcoe.edu.in", role: "store", hostel: "VPPCOE Campus" }
  ];

  for (const a of adminsData) {
    await prisma.user.upsert({
      where: { email: a.email },
      update: { name: a.name, roleId: roleMap[a.role], hostelId: hostelMap[a.hostel] },
      create: {
        email: a.email,
        password: hashedPassword,
        name: a.name,
        roleId: roleMap[a.role],
        hostelId: hostelMap[a.hostel],
        status: "active",
      },
    });
    console.log(`  ✅ Admin/Staff created: ${a.name} (${a.role})`);
  }

  // 5. Create Students
  const studentsData = [
    { name: "Aarav Patel", email: "aarav.p@vppcoe.edu.in", rollNumber: "STU001", academicYear: "1st Year", hostel: "VPPCOE Campus" },
    { name: "Ananya Deshmukh", email: "ananya.d@vppcoe.edu.in", rollNumber: "STU002", academicYear: "2nd Year", hostel: "VPPCOE Campus" },
    { name: "Rohan Mehta", email: "rohan.m@nova.edu.in", rollNumber: "STU003", academicYear: "3rd Year", hostel: "Nova Institute of Technology" },
    { name: "Diya Sharma", email: "diya.s@meridian.edu.in", rollNumber: "STU004", academicYear: "4th Year", hostel: "Meridian College" },
    { name: "Kabir Verma", email: "kabir.v@aurora.edu.in", rollNumber: "STU005", academicYear: "1st Year", hostel: "Aurora Tech Institute" },
    { name: "Isha Nair", email: "isha.n@zenith.edu.in", rollNumber: "STU006", academicYear: "2nd Year", hostel: "Zenith University" }
  ];

  for (const s of studentsData) {
    const studentUser = await prisma.user.upsert({
      where: { email: s.email },
      update: { name: s.name, roleId: roleMap["student"], hostelId: hostelMap[s.hostel] },
      create: {
        email: s.email,
        password: hashedPassword,
        name: s.name,
        roleId: roleMap["student"],
        hostelId: hostelMap[s.hostel],
        status: "active",
      },
    });

    await prisma.student.upsert({
      where: { userId: studentUser.id },
      update: { fullName: s.name, phone: "+91 98765 43210", collegeId: s.rollNumber },
      create: {
        userId: studentUser.id,
        fullName: s.name,
        phone: "+91 98765 43210",
        collegeId: s.rollNumber,
      },
    });
    console.log(`  ✅ Student created: ${s.name} (${s.academicYear})`);
  }

  // 6. Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { userId: superAdminUser.id, action: "SYSTEM_BOOT", details: "System initialized and database seeded" },
      { userId: superAdminUser.id, action: "ONBOARD_HOSTEL", details: "Onboarded VPPCOE Campus Mumbai" },
      { userId: superAdminUser.id, action: "USER_CREATE", details: "Created admin Rahul Sharma" },
      { userId: superAdminUser.id, action: "USER_CREATE", details: "Created warden Neha Kulkarni" },
    ]
  }).catch(() => {});

  console.log("\n🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
