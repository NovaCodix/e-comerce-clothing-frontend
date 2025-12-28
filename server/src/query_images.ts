import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('ERROR: DATABASE_URL no está definido en el entorno. Revisa server/.env');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  try {
    const res = await pool.query('SELECT id, storage_key, url, filename, size_bytes, uploaded_at FROM images ORDER BY uploaded_at DESC LIMIT 20');
    console.log('Filas recuperadas:', res.rowCount);
    console.table(res.rows);
  } catch (err) {
    console.error('Error consultando la BD:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
