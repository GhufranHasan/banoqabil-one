import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();
  const url = new URL(req.url);
  const campusFilter = url.searchParams.get('campusId');

  const matrix = state.offerings
    .filter((off) => {
      if (campusFilter && campusFilter !== 'all') {
        return off.campusId === campusFilter;
      }
      if (campusFilter === 'all') return true;
      if (scope.isGlobal) return true;
      if (scope.role === 'COORDINATOR' && scope.campusIds) {
        return scope.campusIds.includes(off.campusId);
      }
      return true;
    })
    .map((off) => {
      const campus = state.campuses.find((c) => c.id === off.campusId);
      const course = state.courses.find((c) => c.id === off.courseId);
      const batches = state.batches.filter((b) => b.offeringId === off.id);
      const batchIds = batches.map((b) => b.id);

      const activeEnrollments = state.enrollments.filter(
        (e) => batchIds.includes(e.batchId) && e.status !== 'RELEASED'
      ).length;

      const availableSeats = Math.max(0, off.totalCapacity - activeEnrollments);
      const fillRatePct = Math.round((activeEnrollments / off.totalCapacity) * 100);

      return {
        offeringId: off.id,
        campusId: off.campusId,
        campusName: campus?.name || off.campusId,
        courseId: off.courseId,
        courseName: course?.name || off.courseId,
        genderPolicy: off.genderPolicy,
        totalCapacity: off.totalCapacity,
        occupiedSeats: activeEnrollments,
        availableSeats,
        fillRatePct,
        batchesCount: batches.length,
      };
    });

  const totalCapacity = matrix.reduce((sum, m) => sum + m.totalCapacity, 0);
  const totalOccupied = matrix.reduce((sum, m) => sum + m.occupiedSeats, 0);
  const totalAvailable = matrix.reduce((sum, m) => sum + m.availableSeats, 0);

  return NextResponse.json({
    success: true,
    matrix,
    summary: {
      totalCapacity,
      totalOccupied,
      totalAvailable,
      avgFillRatePct: Math.round((totalOccupied / Math.max(1, totalCapacity)) * 100),
    },
  });
}
