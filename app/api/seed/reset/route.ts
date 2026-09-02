import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/demo-data';

export async function POST() {
  try {
    dbStore.reset();
    return NextResponse.json({
      success: true,
      message: 'Demo state successfully reset to initial clean baseline with all 8 planted patterns.',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'RESET_FAILED', message: err.message } }, { status: 500 });
  }
}
