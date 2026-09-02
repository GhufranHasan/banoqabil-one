import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  const filtered = state.followUps.filter((f) => {
    if (scope.isGlobal) return true;
    if (scope.role === 'COORDINATOR' && scope.campusIds) {
      return scope.campusIds.includes(f.campusId);
    }
    if (scope.role === 'TEACHER' && scope.batchIds) {
      return scope.batchIds.includes(f.batchId);
    }
    return true;
  });

  return NextResponse.json({
    success: true,
    followUps: filtered,
    totalCount: filtered.length,
    criticalCount: filtered.filter((f) => f.priority === 'CRITICAL').length,
    highCount: filtered.filter((f) => f.priority === 'HIGH').length,
  });
}
