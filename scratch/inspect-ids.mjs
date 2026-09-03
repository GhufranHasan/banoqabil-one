import { prisma } from '../lib/db';

async function main() {
  const tr = await prisma.transferRequest.findMany();
  console.log('Transfer requests in DB:', tr.map(t => ({ id: t.id, studentId: t.studentId, enrollmentId: t.enrollmentId })));
  const sA = await prisma.student.findUnique({ where: { id: 'stu-dup-1a' } });
  console.log('stu-dup-1a exists?', Boolean(sA));

}

main().finally(() => prisma.$disconnect());
