import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';
import { AttendanceRiskEngine } from '@/lib/risk-engine';

export async function POST(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  try {
    let evaluatedCount = 0;
    let newAtRiskCount = 0;

    state.enrollments.forEach((enr) => {
      if (enr.status === 'ACTIVE' || enr.status === 'AT_RISK') {
        const student = state.students.find((s) => s.id === enr.studentId);
        const batch = state.batches.find((b) => b.id === enr.batchId);

        if (student && batch) {
          // Scope filtering
          if (!scope.isGlobal) {
            if (scope.campusIds && !scope.campusIds.includes(batch.campusId)) return;
            if (scope.batchIds && !scope.batchIds.includes(batch.id)) return;
          }

          evaluatedCount++;
          const records = state.attendanceRecords.filter((a) => a.enrollmentId === enr.id);
          const evalResult = AttendanceRiskEngine.evaluateStudent(enr, student, batch, records);

          if (evalResult) {
            const existingIdx = state.followUps.findIndex((f) => f.enrollmentId === enr.id);
            if (existingIdx >= 0) {
              state.followUps[existingIdx] = { ...state.followUps[existingIdx], ...evalResult };
            } else {
              state.followUps.push(evalResult);
              newAtRiskCount++;
            }
          } else {
            const existingIdx = state.followUps.findIndex((f) => f.enrollmentId === enr.id);
            if (existingIdx >= 0) {
              state.followUps.splice(existingIdx, 1);
            }
          }
        }
      }
    });

    dbStore.addAuditLog({
      actorId: scope.userId,
      actorRole: scope.role,
      actorName: scope.userName || 'System',
      action: 'EVALUATE_ATTENDANCE_RISK',
      entityType: 'RiskEngine',
      details: `Evaluated ${evaluatedCount} enrollments. Flagged ${newAtRiskCount} new at-risk students.`,
      scopeJson: { campusIds: scope.campusIds, role: scope.role },
    });

    return NextResponse.json({
      success: true,
      evaluatedCount,
      newAtRiskCount,
      totalFollowUps: state.followUps.length,
      message: `Nightly risk engine evaluation completed for ${evaluatedCount} students.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
