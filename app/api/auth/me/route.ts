import { NextResponse } from 'next/server';
import { DEMO_PERSONAS, resolveScopeContext } from '@/lib/auth-scope';
import { Role } from '@/lib/types';

export async function GET(req: Request) {
  const scope = resolveScopeContext(req);
  return NextResponse.json({
    success: true,
    user: {
      userId: scope.userId,
      name: scope.userName,
      role: scope.role,
    },
    scope,
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;
    const targetRole = (body.role || 'COORDINATOR').toUpperCase() as Role;

    if (!(targetRole in DEMO_PERSONAS)) {
      return NextResponse.json({ error: { code: 'INVALID_ROLE', message: 'Invalid role specified' } }, { status: 400 });
    }

    const scope = DEMO_PERSONAS[targetRole];
    return NextResponse.json({
      success: true,
      user: {
        userId: scope.userId,
        name: scope.userName,
        role: scope.role,
      },
      scope,
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'AUTH_ERROR', message: err.message } }, { status: 500 });
  }
}
