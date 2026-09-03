import { prisma } from '../lib/db';

async function main() {
  const count = await prisma.enrollment.count();
  const sample = await prisma.enrollment.findMany({ take: 10, select: { id: true, studentId: true } });
  const stu = await prisma.student.findUnique({ where: { id: 'stu-noshow-1' } });
  const enr1 = await prisma.enrollment.findUnique({ where: { id: 'enr-noshow-1' } });
  console.log('stu-noshow-1 in Supabase?', stu);
  console.log('enr-noshow-1 in Supabase?', enr1);

}

main().finally(() => prisma.$disconnect());
