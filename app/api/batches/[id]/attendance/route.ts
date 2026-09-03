import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';
import { DbAdapter } from '@/lib/db-adapter';
import { AttendanceRiskEngine } from '@/lib/risk-engine';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();
  const { id: batchId } = await params;

  try {
    const body = (await req.json()) as any;
    const records = body.records || []; // Array<{ enrollmentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' }>
    const classSessionId = body.classSessionId || `session-${batchId}-${Date.now()}`;

    // Teacher batch scope validation
    if (scope.role === 'TEACHER' && scope.batchIds && !scope.batchIds.includes(batchId)) {
      dbStore.addAuditLog({
        actorId: scope.userId,
        actorRole: scope.role,
        actorName: scope.userName || 'Teacher',
        action: 'SCOPE_DENIED',
        entityType: 'Batch',
        entityId: batchId,
        details: `Teacher attempted to submit attendance for unauthorized batch ${batchId}`,
        scopeJson: { batchIds: scope.batchIds },
        isSecurityAlert: true,
      });
      return NextResponse.json({ success: false, error: 'Unauthorized: Batch outside teacher scope' }, { status: 403 });
    }

    let insertedCount = 0;
    records.forEach((rec: any) => {
      // Prevent duplicate attendance for same session and enrollment
      const existingIdx = state.attendanceRecords.findIndex(
        (a) => a.classSessionId === classSessionId && a.enrollmentId === rec.enrollmentId
      );

      if (existingIdx >= 0) {
        state.attendanceRecords[existingIdx].status = rec.status;
        state.attendanceRecords[existingIdx].markedAt = new Date().toISOString();
      } else {
        state.attendanceRecords.push({
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          classSessionId,
          enrollmentId: rec.enrollmentId,
          batchId,
          status: rec.status || 'PRESENT',
          markedById: scope.userId,
          markedAt: new Date().toISOString(),
        });
        insertedCount++;
      }
    });

    // Run risk engine on batch enrollments
    const batchEnrollments = state.enrollments.filter((e) => e.batchId === batchId);
    batchEnrollments.forEach((enr) => {
      const student = state.students.find((s) => s.id === enr.studentId);
      const batch = state.batches.find((b) => b.id === batchId);
      if (student && batch) {
        const studentRecords = state.attendanceRecords.filter((a) => a.enrollmentId === enr.id);
        const evalResult = AttendanceRiskEngine.evaluateStudent(enr, student, batch, studentRecords);
        if (evalResult) {
          const existingFollowUp = state.followUps.find((f) => f.enrollmentId === enr.id);
          if (!existingFollowUp) {
            state.followUps.push(evalResult);
          }
        }
      }
    });

    // Persist to Supabase
    await DbAdapter.persistAttendance(
      batchId,
      classSessionId,
      new Date(),
      records,
      scope.userId,
      scope.role
    );


    return NextResponse.json({
      success: true,
      message: `Attendance recorded for ${records.length} students. Risk engine evaluation completed.`,
      classSessionId,
      insertedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'ATTENDANCE_FAILED', message: err.message } }, { status: 500 });
  }
}
