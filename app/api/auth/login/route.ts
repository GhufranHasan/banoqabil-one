import { NextResponse } from 'next/server';
import { createSessionToken, DEMO_PERSONAS, hashPassword } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';
import { Role } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;
    const targetRole = (body.role || 'COORDINATOR').toUpperCase().replace(/[\s-]+/g, '_') as Role;
    const password = body.password || '1234';

    if (!(targetRole in DEMO_PERSONAS)) {
      return NextResponse.json({ error: { code: 'INVALID_ROLE', message: 'Invalid role persona' } }, { status: 400 });
    }

    const scope = DEMO_PERSONAS[targetRole];
    const sessionToken = createSessionToken(targetRole, scope.userId);

    dbStore.addAuditLog({
      actorId: scope.userId,
      actorRole: scope.role,
      actorName: scope.userName || 'User',
      action: 'LOGIN',
      entityType: 'UserSession',
      details: `User ${scope.userName} logged in with role ${targetRole}. Session token generated.`,
      scopeJson: { campusIds: scope.campusIds, role: scope.role },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        userId: scope.userId,
        name: scope.userName,
        role: scope.role,
      },
      scope,
      sessionToken,
    });

    // Set secure HTTP-Only cookie
    response.cookies.set({
      name: 'bq_session',
      value: sessionToken,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'LOGIN_FAILED', message: err.message } }, { status: 500 });
  }
}
