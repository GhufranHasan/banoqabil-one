import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';
import { DbAdapter } from '@/lib/db-adapter';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();
  const { id } = await params;

  const run = state.allocationRuns.find((r) => r.id === id) || state.allocationRuns[0];

  if (!run) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Allocation run not found' } }, { status: 404 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as any;
    if (body.stateHash && run.stateHash && body.stateHash !== run.stateHash) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'STALE_STATE',
            message: `Proposal stateHash (${body.stateHash}) does not match current stateHash (${run.stateHash}). Allocation run is stale.`,
          },
        },
        { status: 400 }
      );
    }

    run.status = 'APPROVED';
    run.approvedById = scope.userId;

    const relevantProposals = state.allocationProposals
      .filter((p) => p.runId === run.id && p.batchId)
      .map((p) => ({ studentId: p.studentId, batchId: p.batchId! }));

    // Persist to Supabase
    await DbAdapter.persistApproveAllocation(
      run.id,
      scope.userId,
      scope.userName || 'Coordinator',
      scope.role,
      relevantProposals
    );


    return NextResponse.json({
      success: true,
      message: `Allocation run ${run.id} approved. Batches published successfully.`,
      run,
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'APPROVAL_FAILED', message: err.message } }, { status: 500 });
  }
}
