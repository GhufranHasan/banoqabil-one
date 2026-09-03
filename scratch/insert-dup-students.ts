import { prisma } from '../lib/db';
import { dbStore } from '../lib/demo-data';

async function main() {
  const state = dbStore.getState();
  const dupStudents = [];
  for (const d of state.duplicates) {
    dupStudents.push({
      id: d.studentAId,
      fullName: d.studentAName || 'Student A',
      normalizedName: (d.studentAName || 'Student A').toLowerCase(),
      gender: 'MALE' as any,
      dateOfBirth: new Date('2003-08-14'),
      isMinor: false,
      hasLaptop: true,
    });
    dupStudents.push({
      id: d.studentBId,
      fullName: d.studentBName || 'Student B',
      normalizedName: (d.studentBName || 'Student B').toLowerCase(),
      gender: 'MALE' as any,
      dateOfBirth: new Date('2003-08-14'),
      isMinor: false,
      hasLaptop: true,
    });
  }

  // Also check stu-101 and stu-102
  dupStudents.push(
    {
      id: 'stu-101',
      fullName: 'Ali Khan',
      normalizedName: 'ali khan',
      gender: 'MALE' as any,
      dateOfBirth: new Date('2004-01-01'),
      isMinor: false,
      hasLaptop: true,
    },
    {
      id: 'stu-102',
      fullName: 'Usman Ghani',
      normalizedName: 'usman ghani',
      gender: 'MALE' as any,
      dateOfBirth: new Date('2004-01-01'),
      isMinor: false,
      hasLaptop: true,
    }
  );

  const res = await prisma.student.createMany({
    data: dupStudents,
    skipDuplicates: true,
  });
  console.log('Inserted students for duplicates & transfers:', res.count);

  // Also ensure enrollments enr-101 and enr-102 exist
  await prisma.enrollment.upsert({
    where: { studentId_sessionId: { studentId: 'stu-101', sessionId: 'bq-5.0' } },
    update: {},
    create: { id: 'enr-101', studentId: 'stu-101', batchId: 'batch-wd-gul-m-a', sessionId: 'bq-5.0', status: 'ACTIVE' }
  });
  await prisma.enrollment.upsert({
    where: { studentId_sessionId: { studentId: 'stu-102', sessionId: 'bq-5.0' } },
    update: {},
    create: { id: 'enr-102', studentId: 'stu-102', batchId: 'batch-wd-gul-m-a', sessionId: 'bq-5.0', status: 'ACTIVE' }
  });
  console.log('Ensured enr-101 and enr-102 exist.');
}

main().finally(() => prisma.$disconnect());
