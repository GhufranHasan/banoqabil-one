import { NextResponse } from 'next/server';
import { SeatRecoveryEngine } from '@/lib/recovery-waitlist-engine';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const offeringId = url.searchParams.get('offeringId') || 'off-gul-wd';

  const matches = SeatRecoveryEngine.matchWaitlistCandidates(offeringId);

  return NextResponse.json({
    success: true,
    matches,
    totalMatches: matches.length,
  });
}
