import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function POST(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  try {
    const body = (await req.json()) as any;
    const { trainerId, batchId } = body;

    const teacher = state.teachers.find((t) => t.id === trainerId);
    const batch = state.batches.find((b) => b.id === batchId);

    if (!teacher || !batch) {
      return NextResponse.json({ success: false, error: 'Trainer or Batch not found' }, { status: 404 });
    }

    // RBAC: Coordinator can assign within campus; Super Admin can assign globally
    if (scope.role === 'COORDINATOR' && scope.campusIds && !scope.campusIds.includes(batch.campusId)) {
      return NextResponse.json({ success: false, error: 'Permission Denied: Batch outside coordinator campus' }, { status: 403 });
    }

    const previousTrainerId = batch.trainerId;
    batch.trainerId = trainerId;

    dbStore.addAuditLog({
      actorId: scope.userId,
      actorRole: scope.role,
      actorName: scope.userName || 'User',
      action: 'ASSIGN_TRAINER',
      entityType: 'Batch',
      entityId: batchId,
      details: `Assigned trainer ${teacher.fullName} to batch ${batch.name} (replaced ${previousTrainerId || 'None'}).`,
      scopeJson: { campusIds: scope.campusIds, role: scope.role },
    });

    return NextResponse.json({
      success: true,
      message: `Trainer ${teacher.fullName} assigned to batch ${batch.name} successfully.`,
      batch,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
