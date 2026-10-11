import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/demo-data';

export const runtime = 'nodejs';

export async function POST() {
  try {
    // 1. Immediately reset in-memory baseline (always succeeds and restores all 8 planted scenarios)
    dbStore.reset();

    let syncedToDatabase = false;
    let syncDetail = 'In-memory baseline restored';

    // 2. Safely attempt Supabase database sync if available
    try {
      const { DbAdapter } = await import('@/lib/db-adapter');
      const isConnected = await DbAdapter.checkConnection();
      if (isConnected) {
        const { seedSupabase } = await import('@/scripts/seed-supabase');
        await seedSupabase();
        syncedToDatabase = true;
        syncDetail = 'Supabase database & in-memory baseline fully synchronized';
      } else {
        syncDetail = 'PostgreSQL database is offline or unreachable; in-memory demo data reset';
      }
    } catch (seedErr: any) {
      syncDetail = `Database sync skipped (${seedErr?.message || 'Offline mode'}); in-memory demo data reset`;
      console.warn('[Seed Reset] Database sync skipped or running in background:', seedErr?.message);
    }

    return NextResponse.json({
      success: true,
      activeDataLayer: syncedToDatabase ? 'Supabase/PostgreSQL' : 'In-memory fallback',
      syncedToDatabase,
      detail: syncDetail,
      message: 'Database baseline successfully reset to clean state with all planted patterns.',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Seed Reset Critical Error]:', err);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'RESET_FAILED', message: err?.message || 'Failed to reset demo data' },
      },
      { status: 500 }
    );
  }
}


