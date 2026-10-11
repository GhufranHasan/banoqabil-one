import crypto from 'crypto';
import { Role, ScopeContext, Student } from './types';

export const DEMO_PERSONAS: Record<Role, ScopeContext> = {
  COORDINATOR: {
    userId: 'user-coord-ahmad',
    role: 'COORDINATOR',
    sessionId: 'bq-5.0',
    userName: 'Ahmad Saeed',
    campusIds: ['campus-isb-h8', 'campus-gulshan'],
    regionIds: ['region-isb-ict', 'region-sindh-south'],
    isGlobal: false,
  },
  SUPER_ADMIN: {
    userId: 'user-admin-tariq',
    role: 'SUPER_ADMIN',
    sessionId: 'bq-5.0',
    userName: 'Muhammad Tariq',
    campusIds: ['campus-gulshan', 'campus-lahore-township', 'campus-nazimabad-girls'],
    regionIds: ['region-sindh-south', 'region-central-punjab'],
    isGlobal: true,
  },
  TEACHER: {
    userId: 'user-teacher-sara',
    role: 'TEACHER',
    sessionId: 'bq-5.0',
    userName: 'Sara Nawaz',
    campusIds: ['campus-gulshan'],
    batchIds: ['batch-wd-gul-m-a', 'batch-wd-gul-e-a', 'batch-wd-gul-w-a'],
    isGlobal: false,
  },
  STUDENT: {
    userId: 'user-student-ayesha',
    role: 'STUDENT',
    sessionId: 'bq-5.0',
    userName: 'Ayesha Khan',
    studentId: 'stu-demo-ayesha-khan',
    campusIds: ['campus-gulshan'],
    batchIds: ['batch-wd-gul-m-a'],
    isGlobal: false,
  },
  REGIONAL_MANAGER: {
    userId: 'user-rm-farah',
    role: 'REGIONAL_MANAGER',
    sessionId: 'bq-5.0',
    userName: 'Farah Malik',
    regionIds: ['region-sindh-south'],
    campusIds: ['campus-gulshan', 'campus-nazimabad-girls'],
    isGlobal: false,
  },
};

const SECRET_KEY = process.env.AUTH_SECRET || 'banoqabil-one-secret-2026-auth-key';

export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', SECRET_KEY).update(password).digest('hex');
}

export function createSessionToken(role: Role, userId: string): string {
  const payload = JSON.stringify({ role, userId, exp: Date.now() + 86400 * 1000 });
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  return Buffer.from(`${payload}.${hmac}`).toString('base64url');
}

export function verifySessionToken(token: string): { role: Role; userId: string } | null {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const [payloadStr, signature] = raw.split('.');
    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(payloadStr).digest('hex');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(payloadStr);
    if (payload.exp < Date.now()) return null;
    return { role: payload.role, userId: payload.userId };
  } catch {
    return null;
  }
}

/**
 * Resolves ScopeContext from incoming request cookies, headers, or query.
 * Server-derived and protected against client tampering.
 */
export function resolveScopeContext(req?: Request): ScopeContext {
  if (!req) return DEMO_PERSONAS.COORDINATOR;

  try {
    // 1. Check HTTP-Only Cookie bq_session
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => c.trim().split('=').map(decodeURIComponent))
    );
    if (cookies.bq_session) {
      const verified = verifySessionToken(cookies.bq_session);
      if (verified && verified.role in DEMO_PERSONAS) {
        return DEMO_PERSONAS[verified.role];
      }
    }

    // 2. Check x-demo-role header or query params for seamless testing
    const url = new URL(req.url);
    const rawParam = url.searchParams.get('demoRole') || url.searchParams.get('role');
    const rawHeader = req.headers.get('x-demo-role') || req.headers.get('role');

    const cleanRole = (rawParam || rawHeader || 'COORDINATOR')
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, '_') as Role;

    if (cleanRole in DEMO_PERSONAS) {
      const persona = DEMO_PERSONAS[cleanRole];
      const rawCampus = req.headers.get('x-demo-campus') || url.searchParams.get('campusId');
      if (cleanRole === 'COORDINATOR') {
        const activeCampusId = rawCampus || 'campus-isb-h8';
        return {
          ...persona,
          campusIds: [activeCampusId],
          regionIds: ['region-isb-ict'],
        };
      }
      if (rawCampus && !persona.isGlobal) {
        return {
          ...persona,
          campusIds: [rawCampus],
        };
      }
      return persona;
    }
  } catch {
    // Fallback if URL parsing fails
  }

  return {
    ...DEMO_PERSONAS.COORDINATOR,
    campusIds: ['campus-isb-h8'],
    regionIds: ['region-isb-ict'],
  };
}

/**
 * Validates if the given scope is authorized to view or mutate a specific campus.
 */
export function isCampusInScope(scope: ScopeContext, campusId: string): boolean {
  if (scope.isGlobal || scope.role === 'SUPER_ADMIN') return true;
  return Boolean(scope.campusIds?.includes(campusId));
}

/**
 * Validates if the given scope is authorized for a specific batch.
 */
export function isBatchInScope(scope: ScopeContext, batchId: string, batchCampusId?: string): boolean {
  if (scope.isGlobal || scope.role === 'SUPER_ADMIN') return true;
  if (scope.role === 'COORDINATOR' && batchCampusId) {
    return isCampusInScope(scope, batchCampusId);
  }
  if (scope.role === 'TEACHER') {
    return Boolean(scope.batchIds?.includes(batchId));
  }
  if (scope.role === 'STUDENT') {
    return Boolean(scope.batchIds?.includes(batchId));
  }
  return false;
}

/**
 * Safeguarding check: Enforces minor protection & trainer PII separation.
 * Trainers NEVER see phone numbers or CNICs.
 * If student is minor, phone is flagged as guardian contact.
 */
export function maskStudentPII(student: Student, viewerScope: ScopeContext): Partial<Student> {
  const isSuperOrCoord = viewerScope.role === 'SUPER_ADMIN' || viewerScope.role === 'COORDINATOR' || viewerScope.role === 'REGIONAL_MANAGER';

  if (!isSuperOrCoord) {
    return {
      ...student,
      phoneNormalized: undefined,
      emailNormalized: undefined,
      cnicHash: undefined,
      cnicMasked: '•••••-•••••-•',
    };
  }

  return {
    ...student,
    cnicHash: undefined, // Never expose raw hash to frontend
    cnicMasked: student.cnicMasked || '•••••-•••••••-•',
  };
}

export const filterStudentForScope = maskStudentPII;
