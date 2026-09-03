import { SeatRecoveryEngine } from '../lib/recovery-waitlist-engine';
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

async function runHero3() {
  console.log('🔄 Running Real Hero 3: Dead Seat Detection, Human Release & Waitlist Recovery...\n');

  // 1. Detect dead seat candidates in Gulshan campus
  const candidates = SeatRecoveryEngine.getRecoveryCandidates('campus-gulshan');
  check('Detected dead seat candidates', candidates.length >= 15);
  check('Top candidate is a NO_SHOW case', candidates[0].reason.includes('CRITICAL') || candidates[0].reason.includes('NO_SHOW'));

  const targetEnrollmentId = 'enr-noshow-1';

  // 2. Human Confirmation & Seat Release
  console.log(`Releasing dead seat for ${targetEnrollmentId}...`);
  const releaseReason = 'Student unreachable after 3 coordinator attempts; 0% attendance across 6 weeks.';
  const releaseResult = SeatRecoveryEngine.releaseSeat(
    targetEnrollmentId,
    'user-coord-ahmad',
    'Ahmad Saeed',
    'COORDINATOR',
    releaseReason
  );

  check('Release engine succeeds', releaseResult.success === true);
  check('Freed batch returned', Boolean(releaseResult.freedBatchId));

  // Persist to Supabase
  await DbAdapter.persistReleaseSeat(
    targetEnrollmentId,
    'user-coord-ahmad',
    'Ahmad Saeed',
    'COORDINATOR',
    releaseReason
  );

  // Verify directly from Supabase
  const dbEnr = await prisma.enrollment.findUnique({ where: { id: targetEnrollmentId } });
  check('Enrollment status updated to RELEASED in Supabase', dbEnr?.status === 'RELEASED');
  check('Release reason persisted in Supabase', dbEnr?.releaseReason === releaseReason);

  // 3. Waitlist Ranking & Matching
  const matches = SeatRecoveryEngine.matchWaitlistCandidates(releaseResult.offeringId);
  check('Waitlist candidates found and ranked by merit', matches.length > 0);
  check('Candidate ordered by highest test score', matches[0].score >= (matches[1]?.score || 0));

  const topMatch = matches[0];

  // 4. Offer Seat with 48-hour Hold
  console.log(`Offering seat to waitlist candidate ${topMatch.waitlistId}...`);
  const offerResult = SeatRecoveryEngine.offerSeat(
    topMatch.waitlistId,
    releaseResult.freedBatchId,
    'user-coord-ahmad',
    'Ahmad Saeed'
  );

  check('Seat offer created with hold', Boolean(offerResult.newEnrollment.seatHeldUntil));

  // Persist to Supabase
  await DbAdapter.persistOfferSeat(
    topMatch.waitlistId,
    releaseResult.offeringId,
    releaseResult.freedBatchId,
    'user-coord-ahmad',
    'Ahmad Saeed',
    'COORDINATOR'
  );

  // Verify in Supabase
  const dbWaitlist = await prisma.waitlistEntry.findUnique({ where: { id: topMatch.waitlistId } });
  check('WaitlistEntry status updated to OFFERED in Supabase', dbWaitlist?.status === 'OFFERED');

  // 5. Simulate 48-Hour Hold Expiry
  console.log('Simulating 48-hour hold expiration...');
  await DbAdapter.persistExpireHolds();

  const dbWaitlistExpired = await prisma.waitlistEntry.findUnique({ where: { id: topMatch.waitlistId } });
  check('WaitlistEntry transitioned to EXPIRED in Supabase', dbWaitlistExpired?.status === 'EXPIRED');

  // 6. Verify audit logs in Supabase
  const auditRelease = await prisma.auditLog.findFirst({
    where: { action: 'RELEASE_SEAT', entityId: targetEnrollmentId }
  });
  check('RELEASE_SEAT audit log verified in Supabase', Boolean(auditRelease));

  console.log(`\nHero 3 Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runHero3().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
