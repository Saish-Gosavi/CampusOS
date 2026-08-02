import { prisma } from "../src/config/prisma.js";

async function seedAuditLogs() {
  console.log("🌱 Cleaning up audit logs...");

  const admin = await prisma.user.findFirst({
    where: { email: "admin@campusos.com" },
  });

  const adminId = admin ? admin.id : null;

  // Clear existing audit logs for fresh start with actual data only
  await prisma.auditLog.deleteMany({});

  if (adminId) {
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        module: "System",
        action: "System Initialization",
        description: "Super Admin initialized system workspace.",
        status: "Success",
        ipAddress: "127.0.0.1",
        userAgent: "System Setup",
        oldData: null,
        newData: JSON.stringify({ status: "Initialized" }),
      }
    });
  }

  console.log("✅ Audit log system prepared for actual usage logging!");
}

seedAuditLogs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
