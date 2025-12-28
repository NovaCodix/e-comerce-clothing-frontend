#!/usr/bin/env ts-node
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Pool, QueryResult } from 'pg';

interface Row {
  product_identifier?: string; // puede ser id o slug
  image_path: string; // ruta local o URL
  position?: string;
  alt_text?: string;
  storage_key?: string; // opcional, si ya tiene key en S3
};

interface ImageMeta {
  storage_key: string;
  url: string;
  filename?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  width?: number | null;
  height?: number | null;
}

const DATABASE_URL: string | undefined = process.env.DATABASE_URL;
console.log('DATABASE_URL present?', Boolean(DATABASE_URL));
if (!DATABASE_URL) {
  console.error('ERROR: define DATABASE_URL en el entorno (postgres). Revisa server/.env');
  process.exit(1);
}

const pool: Pool = new Pool({ connectionString: DATABASE_URL });
// prueba de conexión rápida
pool.query('SELECT 1').then(() => console.log('Conexión a Postgres OK')).catch((e: unknown) => { console.error('Error conectando a Postgres:', e); process.exit(1); });

async function insertImage(meta: ImageMeta): Promise<string> {
  const sql = `INSERT INTO images (storage_key, url, filename, mime_type, size_bytes, width, height)
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`;
  const vals = [meta.storage_key, meta.url, meta.filename ?? null, meta.mime_type ?? null, meta.size_bytes ?? null, meta.width ?? null, meta.height ?? null];
  const res = await pool.query(sql, vals);
  return res.rows[0].id as string;
}

async function linkProductImage(productId: string, imageId: string, position = 0, alt_text: string | null = null): Promise<void> {
  const sql = `INSERT INTO product_images (product_id, image_id, position, alt_text) VALUES ($1,$2,$3,$4)`;
  await pool.query(sql, [productId, imageId, position, alt_text]);
}

async function findProductId(identifier: string): Promise<string | null> {
  // intenta por id, por slug y por nombre (ilike)
  let res: QueryResult | { rows: any[] } = await pool.query('SELECT id FROM products WHERE id = $1 LIMIT 1', [identifier]).catch(() => ({ rows: [] } as any));
  if (res.rows && res.rows[0]) return res.rows[0].id;
  res = await pool.query('SELECT id FROM products WHERE slug = $1 LIMIT 1', [identifier]).catch(() => ({ rows: [] } as any));
  if (res.rows && res.rows[0]) return res.rows[0].id;
  res = await pool.query('SELECT id FROM products WHERE name ILIKE $1 LIMIT 1', [identifier]).catch(() => ({ rows: [] } as any));
  if (res.rows && res.rows[0]) return res.rows[0].id;
  return null;
}

function parseCSV(content: string): Row[] {
  const lines: string[] = content.split(/\r?\n/).filter(Boolean);
  const header: string[] = lines.shift()!.split(',').map(h => h.trim());
  return lines.map((line: string) => {
    const cols: string[] = line.split(',');
    const obj: { [key: string]: string } = {};
    header.forEach((h, i) => { obj[h] = cols[i] ? cols[i].trim() : '' });
    return obj as Row;
  });
}

async function processCSV(filePath: string): Promise<void> {
  const resolved = path.resolve(filePath);
  console.log('CSV path resolved to:', resolved);
  if (!fs.existsSync(resolved)) throw new Error('CSV no encontrado: ' + resolved);
  const content = fs.readFileSync(resolved, 'utf-8');
  const rows = parseCSV(content);
  for (const r of rows) {
    await processRow(r);
  }
}

async function processDir(dirPath: string): Promise<void> {
  const resolved = path.resolve(dirPath);
  console.log('Dir path resolved to:', resolved);
  if (!fs.existsSync(resolved)) throw new Error('Directorio no encontrado: ' + resolved);
  const items = fs.readdirSync(resolved);
  for (const f of items) {
    const full = path.join(resolved, f);
    const stat = fs.statSync(full);
    if (stat.isFile()) {
      // sin producto relacionado, insertamos como imagen suelta
      const storage_key: string = f;
      const url: string = `file://${full}`;
      const meta: ImageMeta = {
        storage_key,
        url,
        filename: f,
        mime_type: path.extname(f).replace('.', ''),
        size_bytes: stat.size,
      };
      const imageId: string = await insertImage(meta);
      console.log('Insertada imagen:', imageId, f);
    }
  }
}

async function processRow(r: Row): Promise<void> {
  // si image_path es URL remota o ruta local
  const isUrl: boolean = /^https?:\/\//i.test(r.image_path);
  let storage_key: string = r.storage_key || '';
  let url: string = r.image_path;
  let filename: string = path.basename(r.image_path);
  let mime: string | null = path.extname(filename).replace('.', '') || null;
  let size_bytes: number | null = null;

  if (!isUrl && fs.existsSync(r.image_path)) {
    const stat = fs.statSync(r.image_path);
    size_bytes = stat.size;
    url = `file://${path.resolve(r.image_path)}`;
    storage_key = storage_key || filename;
  }

  const imageId: string = await insertImage({ storage_key: storage_key || filename, url, filename, mime_type: mime || null, size_bytes, width: null, height: null });
  console.log('Imagen insertada:', imageId, '->', url);

  if (r.product_identifier) {
    const pid = await findProductId(r.product_identifier);
    if (pid) {
      await linkProductImage(pid, imageId, Number(r.position || 0), r.alt_text || null);
      console.log('Vinculada a producto:', pid);
    } else {
      console.warn('No se encontró producto para identificador:', r.product_identifier);
    }
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const csv = argv.find(a => a.startsWith('--csv='));
  const dir = argv.find(a => a.startsWith('--dir='));

  try {
    if (csv) {
      const file = csv.split('=')[1];
      console.log('Procesando CSV:', file);
      await processCSV(file);
    } else if (dir) {
      const d = dir.split('=')[1];
      console.log('Procesando directorio:', d);
      await processDir(d);
    } else {
      console.error('Uso: ts-node src/scripts/import_images.ts --csv=map.csv  OR  --dir=./images');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error durante importación:', err);
  } finally {
    await pool.end();
  }
}

main();
