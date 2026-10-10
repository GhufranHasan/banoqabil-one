import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';
import { DbAdapter } from '@/lib/db-adapter';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();
  const { id } = await params;

  try {
    const body = (await req.json().catch(() => ({}))) as any;
    const action = body.action || 'APPROVE'; // APPROVE | REJECT
    const rejectionReason = body.rejectionReason || 'Rejected by administrator';

    const transfer = state.transferRequests.find((t) => t.id === id);
    if (!transfer) {
      return NextResponse.json({ success: false, error: 'Transfer request not found' }, { status: 404 });
    }

    if (transfer.status !== 'PENDING') {
      return NextResponse.json({ success: false, error: `Transfer request is already ${transfer.status}` }, { status: 400 });
    }

    // RBAC Approval Rules:
    // In-Campus: Coordinator, Regional Manager, or Super Admin can approve
    // Cross-Campus: Strictly REGIONAL_MANAGER or SUPER_ADMIN
    if (transfer.isCrossCampus) {
      if (scope.role !== 'REGIONAL_MANAGER' && scope.role !== 'SUPER_ADMIN') {
        dbStore.addAuditLog({
          actorId: scope.userId,
          actorRole: scope.role,
          actorName: scope.userName || 'User',
          action: 'SCOPE_DENIED',
          entityType: 'TransferRequest',
          entityId: id,
          details: `Coordinator attempted to approve cross-campus transfer ${id}. Cross-campus transfers strictly require Regional Manager or Super Admin approval.`,
          scopeJson: { campusIds: scope.campusIds, role: scope.role },
          isSecurityAlert: true,
        });

        return NextResponse.json(
          {
            success: false,
            error: 'Permission Denied: Cross-campus transfers require Regional Manager or Super Admin approval.',
          },
          { status: 403 }
        );
      }
    } else {
      // In-campus transfer scope check: Coordinator must have jurisdiction over campus
      if (scope.role === 'COORDINATOR' && scope.campusIds && !scope.campusIds.includes(transfer.currentCampusId)) {
        return NextResponse.json(
          { success: false, error: 'Permission Denied: Coordinator does not have access to this campus.' },
          { status: 403 }
        );
      }
    }

    if (action === 'REJECT') {
      transfer.status = 'REJECTED';
      transfer.approvedById = scope.userId;
      transfer.rejectionReason = rejectionReason;
      transfer.updatedAt = new Date().toISOString();

      // Persist rejection to Supabase
      await DbAdapter.persistTransfer(id, 'REJECTED', scope.userId);

      await DbAdapter.logAudit({
        actorId: scope.userId,
        actorRole: scope.role,
        actorName: scope.userName || 'User',
        action: 'REJECT_TRANSFER',
        entityType: 'TransferRequest',
        entityId: id,
        details: `Rejected transfer for ${transfer.studentName}. Reason: ${rejectionReason}`,
        scopeJson: { campusIds: scope.campusIds, role: scope.role },
      });

      return NextResponse.json({
        success: true,
        message: 'Transfer request rejected',
        transfer,
      });
    }

    // Approve transfer: update enrollment batch and preserve all attendance records
    const enrollment = state.enrollments.find((e) => e.id === transfer.enrollmentId);
    if (enrollment) {
      const oldBatchId = enrollment.batchId;
      enrollment.batchId = transfer.targetBatchId;

      // Notice: We preserve all attendance records for student (attendance history is intact)
      transfer.status = 'APPROVED';
      transfer.approvedById = scope.userId;
      transfer.updatedAt = new Date().toISOString();

      // Persist approval to Supabase
      await DbAdapter.persistTransfer(id, 'APPROVED', scope.userId, transfer.targetBatchId, transfer.enrollmentId);

      await DbAdapter.logAudit({
        actorId: scope.userId,
        actorRole: scope.role,
        actorName: scope.userName || 'User',
        action: 'APPROVE_TRANSFER',
        entityType: 'TransferRequest',
        entityId: id,
        details: `Approved transfer for ${transfer.studentName} from ${oldBatchId} to ${transfer.targetBatchId}. Attendance history preserved.`,
        scopeJson: { campusIds: scope.campusIds, role: scope.role },
      });


      return NextResponse.json({
        success: true,
        message: `Transfer approved! ${transfer.studentName} moved to ${transfer.targetBatchName}. Attendance history preserved.`,
        transfer,
      });
    }

    return NextResponse.json({ success: false, error: 'Associated enrollment not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
