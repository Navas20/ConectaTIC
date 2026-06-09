import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  connectionString: 'postgresql://postgres:3wR8S2EOh555UPy6@db.faepqocsthgerjanuvpl.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});
try {
  await pool.query('SELECT 1');
  console.log('CONEXION OK');
  const r = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log('TABLAS:', r.rows.map(x => x.table_name));
  await pool.end();
} catch (e) {
  console.error('ERROR:', e.message);
  process.exit(1);
}
