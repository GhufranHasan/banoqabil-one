import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { SeatRecoveryEngine } from '@/lib/recovery-waitlist-engine';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  const campusFilter = scope.isGlobal ? undefined : scope.campusIds;

  const candidates = SeatRecoveryEngine.getRecoveryCandidates(campusFilter);

  return NextResponse.json({
    success: true,
    candidates,
    totalCount: candidates.length,
    estimatedSeatRecoveryPotential: candidates.length,
  });
}
