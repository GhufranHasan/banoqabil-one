import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { SeatRecoveryEngine } from '@/lib/recovery-waitlist-engine';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  const campusId = scope.isGlobal ? undefined : scope.campusIds?.[0];

  const candidates = SeatRecoveryEngine.getRecoveryCandidates(campusId);

  return NextResponse.json({
    success: true,
    candidates,
    totalCount: candidates.length,
    estimatedSeatRecoveryPotential: candidates.length,
  });
}
