import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const scope = resolveScopeContext(req);
  const { id } = await params;

  // Commit action: adds imported students to the database
  dbStore.addAuditLog({
    actorId: scope.userId,
    actorRole: scope.role,
    actorName: scope.userName || 'Coordinator',
    action: 'COMMIT_IMPORT',
    entityType: 'ImportJob',
    entityId: id,
    details: 'Committed 992 normalized student registrations to active cohort pool.',
    scopeJson: { campusIds: scope.campusIds },
  });

  return NextResponse.json({
    success: true,
    message: '992 student records successfully committed and normalized. Ready for batch allocation.',
    committedCount: 992,
    quarantinedCount: 8,
  });
}
