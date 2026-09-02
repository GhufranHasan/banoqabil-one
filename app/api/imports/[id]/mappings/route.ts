import { NextResponse } from 'next/server';
import { resolveScopeContext } from '@/lib/auth-scope';
import { dbStore } from '@/lib/demo-data';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const scope = resolveScopeContext(req);
  const { id } = await params;

  try {
    const body = (await req.json()) as any;
    const { sourceHeader, targetField } = body;

    const state = dbStore.getState();
    const job = state.importJobs.find((j) => j.id === id);

    if (!job) {
      return NextResponse.json({ success: false, error: 'Import job not found' }, { status: 404 });
    }

    const mapping = job.mappings.find((m) => m.sourceHeader === sourceHeader);
    if (mapping) {
      mapping.suggestedField = targetField;
      mapping.status = 'User Mapped';
      mapping.confidence = 'High (Manual Override)';
    } else {
      job.mappings.push({
        sourceHeader,
        suggestedField: targetField,
        confidence: 'High (Manual Override)',
        confidenceScore: 1.0,
        status: 'User Mapped',
        sampleValues: [],
      });
    }

    dbStore.addAuditLog({
      actorId: scope.userId,
      actorRole: scope.role,
      actorName: scope.userName || 'User',
      action: 'UPDATE_IMPORT_MAPPINGS',
      entityType: 'ImportJob',
      entityId: id,
      details: `Updated field mapping for column "${sourceHeader}" -> "${targetField}"`,
      scopeJson: { campusIds: scope.campusIds, role: scope.role },
    });

    return NextResponse.json({
      success: true,
      message: 'Mapping updated successfully',
      job,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
