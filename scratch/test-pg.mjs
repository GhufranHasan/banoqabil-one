import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Use DIRECT_URL for direct connection
const connectionString = process.env.DIRECT_URL;

console.log('Testing PostgreSQL connection to Supabase pooler/direct...');

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL successfully!');
    const res = await client.query('SELECT current_database(), current_user, version();');
    console.log('Query result:', res.rows[0]);
    
    // Check existing tables
    const tables = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Existing public tables count:', tables.rows.length);
    if (tables.rows.length > 0) {
      console.log('Tables:', tables.rows.map(r => r.table_name).join(', '));
    }

    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('PostgreSQL connection error:', err.message);
    process.exit(1);
  }
}

main();
