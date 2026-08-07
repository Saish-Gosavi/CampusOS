/**
 * CampusOS — Letter Allocation Test Data Seeder
 * Run: node prisma/seed-letter-test.js
 *
 * Creates:
 *  - 1 Hostel (VPPCOE Ladies Hostel)
 *  - 1 Warden (asmita15@gmail.com / Warden@123)
 *  - 5 Student accounts with bed allocations
 *  - 5 LetterRequests in various statuses (Pending, Approved, Rejected)
 */

import "dotenv/config";
import mariadb from "mariadb";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import clientPkg from "@prisma/client";
const { PrismaClient } = clientPkg;
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "campusos",
  allowPublicKeyRetrieval: true,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const PASSWORD = "Student@123";

async function main() {
  console.log("🌱 Seeding Letter Allocation test data...\n");

  // ── 1. Ensure student & warden roles ──────────────────────────────────────
  const studentRole = await prisma.role.upsert({
    where: { name: "student" },
    update: {},
    create: { name: "student", description: "Hostel Student" },
  });

  const wardenRole = await prisma.role.upsert({
    where: { name: "warden" },
    update: {},
    create: { name: "warden", description: "Hostel Warden" },
  });

  // ── 2. Ensure Hostel ──────────────────────────────────────────────────────
  const hostel = await prisma.hostel.upsert({
    where: { name: "VPPCOE Ladies Hostel" },
    update: {},
    create: {
      name: "VPPCOE Ladies Hostel",
      city: "Mumbai",
      address: "Sion-Trombay Road, Chembur, Mumbai 400074",
      status: "Active",
    },
  });
  console.log(`  ✅ Hostel: ${hostel.name} (id=${hostel.id})`);

  // ── 3. Ensure Warden linked to this hostel ────────────────────────────────
  const hashedWardenPw = await bcrypt.hash("Warden@123", 10);
  const wardenUser = await prisma.user.upsert({
    where: { email: "asmita15@gmail.com" },
    update: { hostelId: hostel.id },
    create: {
      email: "asmita15@gmail.com",
      password: hashedWardenPw,
      name: "Asmita Pawar",
      roleId: wardenRole.id,
      hostelId: hostel.id,
      status: "active",
    },
  });

  await prisma.warden.upsert({
    where: { userId: wardenUser.id },
    update: { hostelId: hostel.id },
    create: {
      userId: wardenUser.id,
      fullName: "Asmita Pawar",
      phone: "9876543210",
      shift: "Day",
      hostelId: hostel.id,
    },
  });
  console.log(`  ✅ Warden: ${wardenUser.email}`);

  // ── 4. Build Block → Floor → Rooms → Beds ────────────────────────────────
  const block = await prisma.block.create({
    data: { name: "A-Block", hostelId: hostel.id },
  });

  const floor = await prisma.floor.create({
    data: { number: 1, blockId: block.id },
  });

  // Create 5 rooms x 1 bed each for our 5 students
  const roomBeds = [];
  for (let i = 1; i <= 5; i++) {
    const room = await prisma.room.create({
      data: {
        number: `10${i}`,
        floorId: floor.id,
        capacity: 2,
        rent: 3500.0,
      },
    });
    const bed = await prisma.bed.create({
      data: { number: `B${i}`, roomId: room.id },
    });
    roomBeds.push({ room, bed });
  }
  console.log(`  ✅ Created 5 rooms (101–105) with 1 bed each in ${block.name}, Floor ${floor.number}`);

  // ── 5. Create 5 student users ─────────────────────────────────────────────
  const hashedPw = await bcrypt.hash(PASSWORD, 10);

  const studentsData = [
    { email: "priya.sharma@student.vppcoe.edu",  name: "Priya Sharma",  phone: "9001001001", collegeId: "ST2026001" },
    { email: "neha.gupta@student.vppcoe.edu",    name: "Neha Gupta",    phone: "9001001002", collegeId: "ST2026002" },
    { email: "anjali.patil@student.vppcoe.edu",  name: "Anjali Patil",  phone: "9001001003", collegeId: "ST2026003" },
    { email: "riya.joshi@student.vppcoe.edu",    name: "Riya Joshi",    phone: "9001001004", collegeId: "ST2026004" },
    { email: "kavya.mehta@student.vppcoe.edu",   name: "Kavya Mehta",   phone: "9001001005", collegeId: "ST2026005" },
  ];

  const createdStudents = [];
  for (let i = 0; i < studentsData.length; i++) {
    const s = studentsData[i];

    let user = await prisma.user.findUnique({ where: { email: s.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: s.email,
          password: hashedPw,
          name: s.name,
          roleId: studentRole.id,
          hostelId: hostel.id,
          status: "active",
        },
      });
    }

    let student = await prisma.student.findUnique({ where: { userId: user.id } });
    if (!student) {
      student = await prisma.student.create({
        data: {
          userId: user.id,
          fullName: s.name,
          phone: s.phone,
          collegeId: s.collegeId,
        },
      });
    }

    const { bed } = roomBeds[i];
    const allocation = await prisma.allocation.create({
      data: {
        bedId: bed.id,
        studentId: student.id,
        startDate: new Date("2026-06-01"),
        endDate: new Date("2027-05-31"),
        status: "active",
      },
    });

    createdStudents.push({ user, student, allocation });
    console.log(`  ✅ Student: ${s.name} (${s.email}) → Room 10${i + 1}, Bed B${i + 1}`);
  }

  // ── 6. Create LetterRequests in various statuses ──────────────────────────
  const letterStatuses = [
    { idx: 0, status: "Pending",  rejectionReason: null },
    { idx: 1, status: "Pending",  rejectionReason: null },
    { idx: 2, status: "Approved", rejectionReason: null },
    { idx: 3, status: "Rejected", rejectionReason: "Student has outstanding hostel dues. Please clear dues and reapply." },
    { idx: 4, status: "Approved", rejectionReason: null },
  ];

  console.log("\n  📋 Creating Letter Requests...");
  for (const ls of letterStatuses) {
    const { student } = createdStudents[ls.idx];
    const existing = await prisma.letterRequest.findFirst({ where: { studentId: student.id } });
    if (existing) {
      console.log(`     ⚠️  ${studentsData[ls.idx].name} already has a request (skipped)`);
      continue;
    }

    await prisma.letterRequest.create({
      data: {
        studentId: student.id,
        hostelId: hostel.id,
        status: ls.status,
        rejectionReason: ls.rejectionReason,
        approvedById: ls.status !== "Pending" ? wardenUser.id : null,
      },
    });
    console.log(`     ✅ ${studentsData[ls.idx].name} → ${ls.status}`);
  }

  console.log(`
╔════════════════════════════════════════════════════════╗
║     LETTER ALLOCATION TEST DATA — READY!               ║
╠════════════════════════════════════════════════════════╣
║  WARDEN LOGIN                                          ║
║  Email   : asmita15@gmail.com                          ║
║  Password: Warden@123                                  ║
╠════════════════════════════════════════════════════════╣
║  STUDENT LOGINS   (all use Password: Student@123)      ║
║                                                        ║
║  1. priya.sharma@student.vppcoe.edu  → PENDING         ║
║     Room 101 · Bed B1 · ID: ST2026001                 ║
║                                                        ║
║  2. neha.gupta@student.vppcoe.edu    → PENDING         ║
║     Room 102 · Bed B2 · ID: ST2026002                 ║
║                                                        ║
║  3. anjali.patil@student.vppcoe.edu  → APPROVED ✓      ║
║     Room 103 · Bed B3 · ID: ST2026003                 ║
║     → Warden can Generate Letter immediately           ║
║                                                        ║
║  4. riya.joshi@student.vppcoe.edu    → REJECTED ✗      ║
║     Room 104 · Bed B4 · ID: ST2026004                 ║
║     Reason: Outstanding hostel dues                    ║
║                                                        ║
║  5. kavya.mehta@student.vppcoe.edu   → APPROVED ✓      ║
║     Room 105 · Bed B5 · ID: ST2026005                 ║
║     → Warden can Generate Letter immediately           ║
╠════════════════════════════════════════════════════════╣
║  TEST FLOW STEPS:                                      ║
║  1. Warden → Letter Allocation:                        ║
║     • Approve Priya Sharma (Pending)                   ║
║     • Reject Neha Gupta with reason (Pending)          ║
║     • Generate Letter for Anjali Patil (Approved)      ║
║     • Generate Letter for Kavya Mehta (Approved)       ║
║  2. Student → Documents → Download PDF                 ║
║  3. Admin → Room Allotment Letters → Preview & Print   ║
╚════════════════════════════════════════════════════════╝
`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
