import { AttendanceRiskEngine } from '../lib/risk-engine';
import { prisma } from '../lib/db';
import { dbStore } from '../lib/demo-data';

let passed = 0;
let failed = 0;

function check(desc, cond) {
  if (cond) {
    console.log(`✅ PASS: ${desc}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${desc}`);
    failed++;
  }
}

async function runHero2() {
  console.log('📋 Running Real Hero 2: Attendance, Risk Engine (R1-R6) & Follow-ups...\n');

  // 1. Fetch real attendance records from Supabase for Ahmed Raza (Rule R3: Consecutive Absences)
  const ahmedRecords = await prisma.attendanceRecord.findMany({
    where: { enrollmentId: 'enr-ca-1' },
    orderBy: { markedAt: 'asc' },
  });

  check('Fetched Ahmed Raza attendance records from Supabase', ahmedRecords.length === 18);
  const ahmedAbsences = ahmedRecords.filter(r => r.status === 'ABSENT').length;
  check('Ahmed Raza has absences recorded in Supabase', ahmedAbsences >= 3);

  // Run Risk Engine directly on Supabase attendance records
  const ahmedEnr = await prisma.enrollment.findUnique({ where: { id: 'enr-ca-1' } });
  const ahmedStu = await prisma.student.findUnique({ where: { id: 'stu-ahmed-raza' } });
  const ahmedBatch = await prisma.batch.findUnique({ where: { id: 'batch-wd-gul-m-a' } });

  const ahmedEval = AttendanceRiskEngine.evaluateStudent(
    ahmedEnr,
    ahmedStu,
    ahmedBatch,
    ahmedRecords.map(r => ({ ...r, batchId: ahmedBatch.id, markedAt: r.markedAt.toISOString() }))
  );

  check('Risk Engine flags Ahmed Raza', Boolean(ahmedEval));
  check('Ahmed Raza flagged for CONSECUTIVE_ABSENCE (Rule R3)', ahmedEval?.reasonCode === 'CONSECUTIVE_ABSENCE');
  check('Priority is HIGH', ahmedEval?.priority === 'HIGH');

  // 2. Fetch real attendance records from Supabase for Fatima Zahra (Rule R2: Cert Impossible)
  const fatimaRecords = await prisma.attendanceRecord.findMany({
    where: { enrollmentId: 'enr-ci-1' },
    orderBy: { markedAt: 'asc' },
  });
  check('Fetched Fatima Zahra attendance records from Supabase', fatimaRecords.length === 18);

  const fatimaEnr = await prisma.enrollment.findUnique({ where: { id: 'enr-ci-1' } });
  const fatimaStu = await prisma.student.findUnique({ where: { id: 'stu-fatima-zahra' } });
  const fatimaBatch = await prisma.batch.findUnique({ where: { id: 'batch-gd-gul-m-a' } });

  const fatimaEval = AttendanceRiskEngine.evaluateStudent(
    fatimaEnr,
    fatimaStu,
    fatimaBatch,
    fatimaRecords.map(r => ({ ...r, batchId: fatimaBatch.id, markedAt: r.markedAt.toISOString() }))
  );

  check('Fatima Zahra flagged for CERT_IMPOSSIBLE (Rule R2)', fatimaEval?.reasonCode === 'CERT_IMPOSSIBLE');
  check('Priority is CRITICAL', fatimaEval?.priority === 'CRITICAL');

  // 3. Fetch real attendance records from Supabase for No-Show Student (Rule R1: No Show)
  const noShowRecords = await prisma.attendanceRecord.findMany({
    where: { enrollmentId: 'enr-noshow-1' },
  });
  check('Fetched No-Show attendance records from Supabase', noShowRecords.length === 18);
  const allAbsent = noShowRecords.every(r => r.status === 'ABSENT');
  check('No-show student has 0% attendance', allAbsent);

  const noShowEnr = await prisma.enrollment.findUnique({ where: { id: 'enr-noshow-1' } });
  const noShowStu = await prisma.student.findUnique({ where: { id: 'stu-noshow-1' } });

  const noShowEval = AttendanceRiskEngine.evaluateStudent(
    noShowEnr,
    noShowStu,
    ahmedBatch,
    noShowRecords.map(r => ({ ...r, batchId: ahmedBatch.id, markedAt: r.markedAt.toISOString() }))
  );

  check('No-show flagged for NO_SHOW (Rule R1)', noShowEval?.reasonCode === 'NO_SHOW');

  // 4. Verify stored FollowUp cases in Supabase
  const followUpCount = await prisma.followUp.count();
  check('FollowUp cases persisted in Supabase', followUpCount >= 50);

  // 5. Verify Notification generation
  const notifCount = await prisma.notification.count();
  check('Risk notifications persisted in Supabase', notifCount >= 3);

  console.log(`\nHero 2 Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runHero2().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
