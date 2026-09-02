import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/demo-data';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const state = dbStore.getState();

  const notif = state.notifications.find((n) => n.id === id);
  if (!notif) {
    return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 });
  }

  notif.read = true;

  return NextResponse.json({
    success: true,
    message: 'Notification marked as read',
    notification: notif,
  });
}
