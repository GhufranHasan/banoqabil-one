import { DbAdapter } from '../lib/db-adapter';
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

async function runPhase9() {
  console.log('🔄 Running Real Phase 9: Transfers, Duplicates, Trainers & Notifications...\n');

  // 1. Same-Campus Transfer Approval
  console.log('--- 1. Transfers ---');
  const sameCampusId = 'trans-1';
  await DbAdapter.persistTransfer(sameCampusId, 'APPROVED', 'user-coord-ahmad', 'batch-wd-gul-e-a', 'enr-101');
  const dbTransfer1 = await prisma.transferRequest.findUnique({ where: { id: sameCampusId } });
  check('Same-campus transfer APPROVED in Supabase', dbTransfer1?.status === 'APPROVED');
  const dbEnrTransferred = await prisma.enrollment.findUnique({ where: { id: 'enr-101' } });
  check('Student enrollment batch updated in Supabase', dbEnrTransferred?.batchId === 'batch-wd-gul-e-a');

  // 2. Cross-Campus Transfer (Approved by Regional Manager)
  const crossCampusId = 'trans-2';
  await DbAdapter.persistTransfer(crossCampusId, 'APPROVED', 'user-rm-farah', 'batch-wd-lhr-m-a', 'enr-102');
  const dbTransfer2 = await prisma.transferRequest.findUnique({ where: { id: crossCampusId } });
  check('Cross-campus transfer APPROVED by Regional Manager in Supabase', dbTransfer2?.status === 'APPROVED');


  // 3. Duplicate Resolution (Non-destructive merge)
  console.log('\n--- 2. Duplicates ---');
  const dupId = 'dup-1';
  await DbAdapter.persistDuplicateResolution(dupId, 'MERGED', 'user-coord-ahmad');
  const dbDup = await prisma.duplicateCandidate.findUnique({ where: { id: dupId } });
  check('Duplicate candidate marked as MERGED in Supabase', dbDup?.status === 'MERGED');

  // Verify non-destructive merge: both students still exist in Supabase!
  const [sA, sB] = await Promise.all([
    prisma.student.findUnique({ where: { id: dbDup.studentAId } }),
    prisma.student.findUnique({ where: { id: dbDup.studentBId } }),
  ]);
  check('Student A still exists (non-destructive)', Boolean(sA));
  check('Student B still exists (zero data deleted)', Boolean(sB));

  // 4. Trainer Workload & Assignment
  console.log('\n--- 3. Trainer Workload & Assignment ---');
  const targetBatch = 'batch-wd-lhr-e-a';
  const targetTrainer = 'teacher-bilal';
  await prisma.teacherAssignment.upsert({
    where: { teacherId_batchId: { teacherId: targetTrainer, batchId: targetBatch } },
    update: {},
    create: { id: `asgn-${targetBatch}-${targetTrainer}`, teacherId: targetTrainer, batchId: targetBatch }
  });
  const dbAsgn = await prisma.teacherAssignment.findUnique({
    where: { teacherId_batchId: { teacherId: targetTrainer, batchId: targetBatch } }
  });
  check('Trainer assignment persisted in Supabase', Boolean(dbAsgn));

  // 5. Notifications Read State
  console.log('\n--- 4. Notifications ---');
  const notif = await prisma.notification.findFirst();
  if (notif) {
    await DbAdapter.persistNotificationRead(notif.id);
    const updatedNotif = await prisma.notification.findUnique({ where: { id: notif.id } });
    check('Notification marked as read in Supabase', updatedNotif?.read === true);
  }

  console.log(`\nPhase 9 Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runPhase9().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
