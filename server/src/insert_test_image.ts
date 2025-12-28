import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  const conn = process.env.DATABASE_URL;
  if (!conn) {
    console.error('ERROR: define DATABASE_URL en server/.env');
    process.exit(1);
  }
  const pool = new Pool({ connectionString: conn });
  try {
    const meta = {
      storage_key: 'test-image-001.jpg',
      url: 'https://example.com/test-image-001.jpg',
      filename: 'test-image-001.jpg',
      mime_type: 'jpg',
      size_bytes: 12345,
      width: null,
      height: null,
    } as any;
    const res = await pool.query(
      `INSERT INTO images (storage_key, url, filename, mime_type, size_bytes, width, height) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [meta.storage_key, meta.url, meta.filename, meta.mime_type, meta.size_bytes, meta.width, meta.height]
    );
    console.log('Inserted test image id:', res.rows[0].id);
  } catch (err) {
    console.error('Error inserting test image:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
