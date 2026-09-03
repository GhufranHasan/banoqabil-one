import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/demo-data';
import { seedSupabase } from '@/scripts/seed-supabase';

export async function POST() {
  try {
    // Reset in-memory fallback store
    dbStore.reset();
    // Reset real Supabase PostgreSQL database
    await seedSupabase();

    return NextResponse.json({
      success: true,
      activeDataLayer: 'Supabase/PostgreSQL',
      message: 'Supabase PostgreSQL database & demo baseline successfully reset to initial clean state with all planted patterns.',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'RESET_FAILED', message: err.message } }, { status: 500 });
  }
}

