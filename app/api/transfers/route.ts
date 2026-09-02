import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';
import { TransferRequest } from '@/lib/types';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  let transfers = state.transferRequests;

  // Filter based on scope
  if (!scope.isGlobal) {
    if (scope.campusIds && scope.campusIds.length > 0) {
      transfers = transfers.filter(
        (t) => scope.campusIds!.includes(t.currentCampusId) || scope.campusIds!.includes(t.targetCampusId)
      );
    }
  }

  return NextResponse.json({
    success: true,
    transfers,
  });
}

export async function POST(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  try {
    const body = (await req.json()) as any;
    const { enrollmentId, targetBatchId, reason } = body;

    const enrollment = state.enrollments.find((e) => e.id === enrollmentId);
    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Enrollment not found' }, { status: 404 });
    }

    const student = state.students.find((s) => s.id === enrollment.studentId);
    const currentBatch = state.batches.find((b) => b.id === enrollment.batchId);
    const targetBatch = state.batches.find((b) => b.id === targetBatchId);

    if (!student || !currentBatch || !targetBatch) {
      return NextResponse.json({ success: false, error: 'Student or batch not found' }, { status: 404 });
    }

    const currentCampus = state.campuses.find((c) => c.id === currentBatch.campusId);
    const targetCampus = state.campuses.find((c) => c.id === targetBatch.campusId);

    // Rule 1: Gender Compatibility
    if (targetBatch.genderPolicy === 'MALE_ONLY' && student.gender === 'FEMALE') {
      return NextResponse.json(
        { success: false, error: 'Gender policy violation: Female student cannot transfer to MALE_ONLY batch/campus' },
        { status: 400 }
      );
    }
    if (targetBatch.genderPolicy === 'FEMALE_ONLY' && student.gender === 'MALE') {
      return NextResponse.json(
        { success: false, error: 'Gender policy violation: Male student cannot transfer to FEMALE_ONLY batch/campus' },
        { status: 400 }
      );
    }

    // Rule 2: Capacity check
    const targetEnrolledCount = state.enrollments.filter(
      (e) => e.batchId === targetBatchId && (e.status === 'ACTIVE' || e.status === 'ALLOCATED' || e.status === 'AT_RISK')
    ).length;

    if (targetEnrolledCount >= targetBatch.capacity) {
      return NextResponse.json(
        { success: false, error: `Capacity overflow: Target batch ${targetBatch.name} is already at maximum capacity (${targetBatch.capacity}/${targetBatch.capacity})` },
        { status: 400 }
      );
    }

    const isCrossCampus = currentBatch.campusId !== targetBatch.campusId;

    const transferRequest: TransferRequest = {
      id: `trans-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      enrollmentId,
      studentId: student.id,
      studentName: student.fullName,
      currentBatchId: currentBatch.id,
      currentBatchName: currentBatch.name,
      targetBatchId: targetBatch.id,
      targetBatchName: targetBatch.name,
      currentCampusId: currentBatch.campusId,
      currentCampusName: currentCampus?.name || currentBatch.campusId,
      targetCampusId: targetBatch.campusId,
      targetCampusName: targetCampus?.name || targetBatch.campusId,
      isCrossCampus,
      reason: reason || 'Learner requested batch/shift transfer',
      status: 'PENDING',
      requestedById: scope.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.transferRequests.push(transferRequest);

    dbStore.addAuditLog({
      actorId: scope.userId,
      actorRole: scope.role,
      actorName: scope.userName || 'User',
      action: 'REQUEST_TRANSFER',
      entityType: 'TransferRequest',
      entityId: transferRequest.id,
      details: `Requested transfer for ${student.fullName} from ${currentBatch.name} to ${targetBatch.name} (${isCrossCampus ? 'Cross-Campus' : 'In-Campus'}).`,
      scopeJson: { campusIds: scope.campusIds, role: scope.role },
    });

    return NextResponse.json({
      success: true,
      message: 'Transfer request created successfully',
      transfer: transferRequest,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
