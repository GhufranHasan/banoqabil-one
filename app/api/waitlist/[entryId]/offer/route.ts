import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { DbAdapter } from '@/lib/db-adapter';
import { SeatRecoveryEngine } from '@/lib/recovery-waitlist-engine';

export async function POST(req: Request, { params }: { params: Promise<{ entryId: string }> }) {
  const scope = resolveScopeContext(req);
  const { entryId } = await params;

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body optional
    }

    const batchId = body.batchId || 'batch-wd-gul-m-a';

    const result = SeatRecoveryEngine.offerSeat(
      entryId,
      batchId,
      scope.userId,
      scope.userName || 'Coordinator'
    );

    // Persist to Supabase
    await DbAdapter.persistOfferSeat(
      entryId,
      result.newEnrollment.batchId,
      batchId,
      scope.userId,
      scope.userName || 'Coordinator',
      scope.role
    );


    return NextResponse.json({
      success: true,
      message: 'Waitlist candidate offered seat with 48h reservation hold.',
      enrollment: result.newEnrollment,
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'OFFER_FAILED', message: err.message } }, { status: 500 });
  }
}
