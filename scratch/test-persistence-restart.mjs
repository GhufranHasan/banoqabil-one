import { execSync } from 'child_process';
import { prisma } from '../lib/db';
import { DbAdapter } from '../lib/db-adapter';
import { seedSupabase } from '../scripts/seed-supabase';

async function step1_mutate() {
  console.log('--- Step 1: Resetting Supabase & creating mutation ---');
  // Seed clean state
  await seedSupabase();

  const uniqueReason = `Verified persistent release at ${new Date().toISOString()}`;
  console.log('Creating persistent mutation on enr-noshow-1...');
  await DbAdapter.persistReleaseSeat(
    'enr-noshow-1',
    'user-coord-ahmad',
    'Ahmad Saeed',
    'COORDINATOR',
    uniqueReason
  );

  console.log('Mutation applied. Closing database connection and killing process memory...');
  await prisma.$disconnect();
}

async function main() {
  await step1_mutate();

  console.log('\n--- Step 2: Simulating Process Death & Complete Application Restart ---');
  // Run isolated separate Node subprocess to verify zero in-memory state leakage
  const verifyCommand = `npx tsx -e "
    import { prisma } from './lib/db';
    import { dbStore } from './lib/demo-data';

    async function check() {
      // 1. Direct Supabase Query
      const enr = await prisma.enrollment.findUnique({ where: { id: 'enr-noshow-1' } });
      console.log('Queried Supabase after restart:');
      console.log('  Status:', enr?.status);
      console.log('  Reason:', enr?.releaseReason);

      if (enr?.status !== 'RELEASED' || !enr?.releaseReason?.includes('Verified persistent release')) {
        console.error('❌ Data did not persist across restart in Supabase!');
        process.exit(1);
      }

      // 2. Hydrated Memory Store Check
      await dbStore.hydrateFromSupabase();
      const memEnr = dbStore.getState().enrollments.find(e => e.id === 'enr-noshow-1');
      console.log('Queried Hydrated In-Memory Store after restart:');
      console.log('  Status:', memEnr?.status);
      console.log('  Reason:', memEnr?.releaseReason);

      if (memEnr?.status !== 'RELEASED') {
        console.error('❌ In-memory store failed to hydrate persisted Supabase state!');
        process.exit(1);
      }

      console.log('✅ RESTART PERSISTENCE VERIFIED: Data survived 100% across cold process reboot!');
      await prisma.\\$disconnect();
    }
    check();
  "`;

  execSync(verifyCommand, { stdio: 'inherit' });
}

main().catch(console.error);
