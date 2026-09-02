import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function POST(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  try {
    const now = new Date();
    let expiredCount = 0;

    state.enrollments.forEach((enr) => {
      if (enr.seatHeldUntil && new Date(enr.seatHeldUntil) < now && enr.status === 'ALLOCATED') {
        enr.status = 'RELEASED';
        enr.releasedAt = now.toISOString();
        enr.releaseReason = '48-hour reservation hold expired without confirmation';
        expiredCount++;

        // Update corresponding waitlist entry if present
        const waitlistEntry = state.waitlist.find((w) => w.studentId === enr.studentId);
        if (waitlistEntry && waitlistEntry.status === 'OFFERED') {
          waitlistEntry.status = 'EXPIRED';
        }
      }
    });

    if (expiredCount > 0) {
      dbStore.addAuditLog({
        actorId: scope.userId,
        actorRole: scope.role,
        actorName: scope.userName || 'System Cron',
        action: 'EXPIRE_SEAT_HOLDS',
        entityType: 'Enrollment',
        details: `Auto-expired ${expiredCount} unclaimed 48h reservation holds. Seats returned to open capacity.`,
        scopeJson: { isGlobal: true },
      });
    }

    return NextResponse.json({
      success: true,
      expiredCount,
      message: `Checked reservation holds. ${expiredCount} expired holds returned to available capacity pool.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
