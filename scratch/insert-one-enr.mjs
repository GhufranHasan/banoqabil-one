import { prisma } from '../lib/db';

async function main() {
  try {
    const res = await prisma.enrollment.create({
      data: {
        id: 'enr-noshow-1',
        studentId: 'stu-noshow-1',
        batchId: 'batch-wd-gul-m-a',
        sessionId: 'bq-5.0',
        status: 'AT_RISK',
        allocatedAt: new Date('2026-01-05'),
      },
    });
    console.log('Successfully created enr-noshow-1:', res);
  } catch (err) {
    console.error('Failed to create enr-noshow-1:', err);
  }
}

main().finally(() => prisma.$disconnect());
