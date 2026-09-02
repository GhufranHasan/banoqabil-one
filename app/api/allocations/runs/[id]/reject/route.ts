import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const scope = resolveScopeContext(req);
  const { id } = await params;

  try {
    const body = (await req.json().catch(() => ({}))) as any;
    const reason = body.reason || 'Coordinator rejected batch allocation proposal';

    const state = dbStore.getState();
    const run = state.allocationRuns.find((r) => r.id === id);

    if (!run) {
      return NextResponse.json({ success: false, error: 'Allocation run not found' }, { status: 404 });
    }

    run.status = 'REJECTED';

    dbStore.addAuditLog({
      actorId: scope.userId,
      actorRole: scope.role,
      actorName: scope.userName || 'User',
      action: 'REJECT_ALLOCATION',
      entityType: 'AllocationRun',
      entityId: id,
      details: `Rejected allocation run ${id}. Reason: ${reason}`,
      scopeJson: { campusIds: scope.campusIds, role: scope.role },
    });

    return NextResponse.json({
      success: true,
      message: 'Allocation run rejected',
      run,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
