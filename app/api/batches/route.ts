import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  const scopedBatches = state.batches.filter((b) => {
    if (scope.isGlobal) return true;
    if (scope.role === 'COORDINATOR' && scope.campusIds) {
      return scope.campusIds.includes(b.campusId);
    }
    if (scope.role === 'TEACHER' && scope.batchIds) {
      return scope.batchIds.includes(b.id);
    }
    return true;
  });

  const batchesWithMetrics = scopedBatches.map((b) => {
    const course = state.courses.find((c) => c.id === b.courseId);
    const campus = state.campuses.find((c) => c.id === b.campusId);
    const trainer = state.teachers.find((t) => t.id === b.trainerId);
    const activeEnrollments = state.enrollments.filter((e) => e.batchId === b.id && e.status !== 'RELEASED').length;

    return {
      ...b,
      courseName: course?.name || b.courseId,
      campusName: campus?.name || b.campusId,
      trainerName: trainer?.fullName || 'Unassigned',
      enrolledCount: activeEnrollments,
      fillRatePct: Math.round((activeEnrollments / b.capacity) * 100),
      isOverloaded: activeEnrollments > b.capacity,
    };
  });

  return NextResponse.json({
    success: true,
    batches: batchesWithMetrics,
    totalBatches: batchesWithMetrics.length,
  });
}
