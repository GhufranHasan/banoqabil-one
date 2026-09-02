import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  const scoped = state.duplicates.filter((d) => {
    if (scope.isGlobal) return true;
    if (scope.role === 'COORDINATOR' && scope.campusIds) {
      return scope.campusIds.includes(d.campusId);
    }
    return true;
  });

  return NextResponse.json({
    success: true,
    duplicates: scoped,
    totalCount: scoped.length,
    pendingCount: scoped.filter((d) => d.status === 'PENDING').length,
  });
}
