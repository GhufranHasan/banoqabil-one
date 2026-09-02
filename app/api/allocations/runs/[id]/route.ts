import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/demo-data';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const state = dbStore.getState();

  const run = state.allocationRuns.find((r) => r.id === id);
  if (!run) {
    return NextResponse.json({ success: false, error: 'Allocation run not found' }, { status: 404 });
  }

  const proposals = state.allocationProposals.filter((p) => p.runId === id);

  return NextResponse.json({
    success: true,
    run,
    proposals,
    stats: run.stats,
  });
}
