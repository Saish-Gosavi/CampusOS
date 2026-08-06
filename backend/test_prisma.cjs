const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const students = await prisma.student.count();
    console.log('Students count:', students);
  } catch(e) {
    console.error('Error fetching students:', e);
  }
}

main().finally(() => prisma.$disconnect());
