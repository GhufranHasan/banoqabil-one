import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  const scopedTeachers = state.teachers.filter((t) => {
    if (scope.isGlobal) return true;
    if (scope.role === 'COORDINATOR' && scope.campusIds) {
      return scope.campusIds.includes(t.campusId);
    }
    if (scope.role === 'TEACHER') {
      return t.fullName.toLowerCase().includes('sara');
    }
    return true;
  });

  const workloads = scopedTeachers.map((t) => {
    const assignedBatches = state.batches.filter((b) => b.trainerId === t.id);
    const campus = state.campuses.find((c) => c.id === t.campusId);
    const isImbalanced = assignedBatches.length > t.maxWeeklyBatches;

    return {
      id: t.id,
      name: t.fullName,
      email: t.email,
      specialization: t.specialization,
      campusName: campus?.name || t.campusId,
      assignedBatchesCount: assignedBatches.length,
      maxWeeklyBatches: t.maxWeeklyBatches,
      weeklyTeachingHours: assignedBatches.length * 6, // 3 sessions * 2h
      isImbalanced,
      batches: assignedBatches.map((b) => b.name),
      status: isImbalanced ? 'Overloaded' : assignedBatches.length === 0 ? 'Available' : 'Optimal',
    };
  });

  return NextResponse.json({
    success: true,
    workloads,
    totalTrainers: workloads.length,
    imbalancedCount: workloads.filter((w) => w.isImbalanced).length,
  });
}
