import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { SeatRecoveryEngine } from '@/lib/recovery-waitlist-engine';

export async function POST(req: Request, { params }: { params: Promise<{ enrollmentId: string }> }) {
  const scope = resolveScopeContext(req);
  const { enrollmentId } = await params;

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body optional
    }

    const reason = body.reason || 'Unreachable after repeated coordinator contact; complete no-show across first 6 weeks.';

    const result = SeatRecoveryEngine.releaseSeat(
      enrollmentId,
      scope.userId,
      scope.userName || 'Coordinator',
      scope.role,
      reason
    );

    // Automatically match waitlist candidates for this freed slot
    const matches = SeatRecoveryEngine.matchWaitlistCandidates(result.offeringId);

    return NextResponse.json({
      success: true,
      message: 'Dead seat released successfully. Waitlist candidates matched.',
      freedBatchId: result.freedBatchId,
      offeringId: result.offeringId,
      matches,
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'RELEASE_FAILED', message: err.message } }, { status: 500 });
  }
}
