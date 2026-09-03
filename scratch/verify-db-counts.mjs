import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const [
    students,
    enrollments,
    batches,
    campuses,
    attendance,
    followUps,
    waitlist,
    duplicates,
    transfers
  ] = await Promise.all([
    prisma.student.count(),
    prisma.enrollment.count(),
    prisma.batch.count(),
    prisma.campus.count(),
    prisma.attendanceRecord.count(),
    prisma.followUp.count(),
    prisma.waitlistEntry.count(),
    prisma.duplicateCandidate.count(),
    prisma.transferRequest.count(),
  ]);

  console.log('REAL SUPABASE POSTGRESQL COUNTS:');
  console.log({
    students,
    enrollments,
    batches,
    campuses,
    attendance,
    followUps,
    waitlist,
    duplicates,
    transfers
  });

  const sampleStudent = await prisma.student.findFirst({
    where: { id: 'stu-ahmed-raza' },
    include: { enrollments: true }
  });
  console.log('Verified Ahmed Raza in Supabase:', sampleStudent?.fullName, 'Enrollments:', sampleStudent?.enrollments.length);
}

main().finally(() => prisma.$disconnect());
