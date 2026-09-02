import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/demo-data';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const state = dbStore.getState();
  const job = state.importJobs.find((j) => j.id === id);

  if (!job) {
    return NextResponse.json({ success: false, error: 'Import job not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    job,
  });
}
