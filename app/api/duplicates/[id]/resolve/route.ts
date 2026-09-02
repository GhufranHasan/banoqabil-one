import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();
  const { id } = await params;

  try {
    const body = (await req.json()) as any;
    const action = (body.action || 'MERGE').toUpperCase(); // MERGE | NOT_DUPLICATE | MANUAL_REVIEW | DISMISS

    const dup = state.duplicates.find((d) => d.id === id);
    if (!dup) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Duplicate record not found' } }, { status: 404 });
    }

    if (action === 'MERGE') {
      dup.status = 'MERGED';
      // Invariant: No automatic deletion. Secondary record is marked with merged alias.
      const studentA = state.students.find((s) => s.id === dup.studentAId);
      const studentB = state.students.find((s) => s.id === dup.studentBId);
      if (studentA && studentB) {
        studentA.sourceReference = `Merged from alias ${studentB.fullName} (${studentB.id})`;
      }
    } else if (action === 'NOT_DUPLICATE' || action === 'DISMISS') {
      dup.status = 'DISMISSED';
    } else if (action === 'MANUAL_REVIEW') {
      dup.status = 'PENDING';
    }

    dbStore.addAuditLog({
      actorId: scope.userId,
      actorRole: scope.role,
      actorName: scope.userName || 'Coordinator',
      action: 'RESOLVE_DUPLICATE',
      entityType: 'DuplicateCandidate',
      entityId: id,
      details: `Resolved duplicate pair (${dup.studentAName} & ${dup.studentBName}) with action: ${action}. Zero data deleted.`,
      scopeJson: { campusIds: [dup.campusId] },
    });

    return NextResponse.json({
      success: true,
      message: `Duplicate resolved with status: ${dup.status}`,
      duplicate: dup,
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'RESOLVE_FAILED', message: err.message } }, { status: 500 });
  }
}
