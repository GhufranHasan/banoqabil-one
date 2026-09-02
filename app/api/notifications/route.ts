import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();

  const notifs = state.notifications.filter((n) => {
    if (!n.role) return true;
    return n.role === scope.role || scope.role === 'SUPER_ADMIN';
  });

  return NextResponse.json({
    success: true,
    notifications: notifs,
    unreadCount: notifs.filter((n) => !n.read).length,
  });
}
