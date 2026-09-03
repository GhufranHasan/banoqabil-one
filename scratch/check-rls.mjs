import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const client = await pool.connect();
  const res = await client.query(`
    SELECT 
      relname as table_name,
      relrowsecurity as rls_enabled,
      relforcerowsecurity as rls_forced
    FROM pg_class
    JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
    WHERE pg_namespace.nspname = 'public' AND relkind = 'r'
    ORDER BY relname;
  `);

  console.log('PostgreSQL Table RLS Status in Supabase:');
  res.rows.forEach(r => {
    console.log(`- ${r.table_name}: RLS=${r.rls_enabled ? 'ENABLED' : 'DISABLED'}`);
  });

  client.release();
  await pool.end();
}

main().catch(console.error);
