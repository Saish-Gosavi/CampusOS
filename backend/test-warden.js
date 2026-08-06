import { WardenService } from "./src/modules/hostel/wardens/services/warden.service.js";
import { prisma } from "./src/config/prisma.js";

async function testCreateWarden() {
  console.log("Testing WardenService.create()...");
  try {
    const res = await WardenService.create({
      email: "wardentest@campusos.com",
      password: "password123",
      fullName: "Test Warden",
      phone: "+91 98000 00000",
      hostelId: 1,
      shift: "Day"
    });
    console.log("SUCCESS! Warden created:", res);
  } catch (err) {
    console.error("WARDEN CREATE ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testCreateWarden();
