import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const scope = resolveScopeContext(req);
  const state = dbStore.getState();
  const { id } = await params;

  try {
    const body = (await req.json()) as any;
    const followUp = state.followUps.find((f) => f.id === id);

    if (!followUp) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Follow-up not found' } }, { status: 404 });
    }

    if (body.status) {
      followUp.status = body.status;
    }

    if (body.note) {
      followUp.notes.push({
        id: `note-${Date.now()}`,
        author: scope.userName || 'Staff',
        text: body.note,
        createdAt: new Date().toISOString(),
      });
    }

    dbStore.addAuditLog({
      actorId: scope.userId,
      actorRole: scope.role,
      actorName: scope.userName || 'Coordinator',
      action: 'UPDATE_FOLLOWUP',
      entityType: 'FollowUp',
      entityId: id,
      details: `Updated follow-up status for student ${followUp.studentName} to "${followUp.status}".`,
      scopeJson: { campusIds: [followUp.campusId] },
    });

    return NextResponse.json({ success: true, followUp });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'UPDATE_FAILED', message: err.message } }, { status: 500 });
  }
}
