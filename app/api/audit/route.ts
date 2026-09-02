import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  const logs = state.auditLogs.filter((log) => {
    if (scope.isGlobal || scope.role === 'SUPER_ADMIN') return true;
    if (log.actorId === scope.userId) return true;
    if (scope.role === 'COORDINATOR' && scope.campusIds) {
      if (log.scopeJson?.campusIds) {
        return log.scopeJson.campusIds.some((cid) => scope.campusIds?.includes(cid));
      }
      return true;
    }
    return true;
  });

  return NextResponse.json({
    success: true,
    logs,
    totalLogs: logs.length,
    securityAlertsCount: logs.filter((l) => l.isSecurityAlert).length,
  });
}
