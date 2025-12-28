import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

// Escanea el árbol de frontend para extraer URLs de imágenes remotas y las inserta en la BD.

const FRONTEND_ROOT = process.argv.find(a => a.startsWith('--src='))?.split('=')[1] || path.resolve(__dirname, '../..', 'src');
const DRY = process.argv.includes('--dry');
// Match URLs that either end with an image extension or contain image format query params (e.g. fm=jpg)
const IMAGE_REGEX = /(https?:\/\/[^\s"'<>]+?(?:\.(?:png|jpe?g|gif|webp|svg)|(?:[?&](?:fm|format)=(?:png|jpe?g|gif|webp|svg)))[^\s"'<>]*)/gi;
const IMPORT_REGEX = /import\s+[^'"\n]+['"]([^'"\n]+\.(?:png|jpe?g|gif|webp|svg))['"]/gi;
const REQUIRE_REGEX = /require\(['"]([^'"\)]+\.(?:png|jpe?g|gif|webp|svg))['"]\)/gi;
const RELATIVE_PATH_REGEX = /['"`]((?:\.\.?\/|\/)?.+?\.(?:png|jpe?g|gif|webp|svg))['"`]/gi;

function walkDir(dir: string, files: string[] = []) {
  const items = fs.readdirSync(dir);
  for (const it of items) {
    const full = path.join(dir, it);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkDir(full, files);
    else if (/\.(tsx|ts|jsx|js|html|md|css)$/.test(full)) files.push(full);
  }
  return files;
}

async function findProductId(pool: Pool, identifier: string) {
  if (!identifier) return null;
  // try by slug
  const r1 = await pool.query('SELECT id FROM products WHERE slug = $1 LIMIT 1', [identifier]).catch(() => ({ rows: [] } as any));
  if (r1.rows && r1.rows[0]) return r1.rows[0].id;
  const r2 = await pool.query('SELECT id FROM products WHERE name ILIKE $1 LIMIT 1', ["%" + identifier + "%"]).catch(() => ({ rows: [] } as any));
  if (r2.rows && r2.rows[0]) return r2.rows[0].id;
  return null;
}

async function insertImage(pool: Pool, meta: any) {
  const sql = `INSERT INTO images (storage_key, url, filename, mime_type, size_bytes, width, height) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`;
  const vals = [meta.storage_key, meta.url, meta.filename ?? null, meta.mime_type ?? null, meta.size_bytes ?? null, meta.width ?? null, meta.height ?? null];
  // avoid duplicate by url
  const existing = await pool.query('SELECT id FROM images WHERE url = $1 LIMIT 1', [meta.url]);
  if (existing.rows && existing.rows[0]) return existing.rows[0].id;
  const res = await pool.query(sql, vals);
  return res.rows[0].id;
}

async function linkProductImage(pool: Pool, productId: string, imageId: string) {
  await pool.query('INSERT INTO product_images (product_id,image_id,position) VALUES ($1,$2,$3)', [productId, imageId, 0]);
}

async function probeUrl(url: string) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    // Try HEAD first (lightweight). Some providers block HEAD, so fallback to GET.
    let res: Response | null = null;
    try {
      res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) {
        // treat non-2xx as failure and fallback
        res = null;
      }
    } catch (_e) {
      res = null;
    }

    if (!res) {
      try {
        res = await fetch(url, { method: 'GET' });
      } catch (e:any) {
        console.warn('GET probe failed for', url, e?.message || e);
        return null;
      }
    }

    if (!res) return null;
    if (!res.ok) {
      console.warn('Probe returned non-ok status for', url, res.status);
      return null;
    }
    const contentType = res.headers.get('content-type') || '';
    const contentLength = res.headers.get('content-length');
    return { contentType, contentLength: contentLength ? parseInt(contentLength, 10) : undefined };
  } catch (err:any) {
    console.warn('probe error', url, err?.message || err);
    return null;
  }
  } catch (e) {
    return { size: null, type: null };
  }
}

async function main() {
  const conn = process.env.DATABASE_URL;
  if (!conn) {
    console.error('ERROR: DATABASE_URL no definido (server/.env)');
    process.exit(1);
  }
  const pool = new Pool({ connectionString: conn });
  try {
    console.log('Frontend root escaneado:', FRONTEND_ROOT);
    const files = walkDir(FRONTEND_ROOT);
    console.log('Archivos a escanear:', files.length);
    const urls = new Set<string>();
    const localFiles = new Set<string>();
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf-8');
      let m: RegExpExecArray | null;
      // remote http(s) links
      while ((m = IMAGE_REGEX.exec(content)) !== null) {
        urls.add(m[1]);
      }
      // import '.../img.png'
      while ((m = IMPORT_REGEX.exec(content)) !== null) {
        const matched = m[1];
        // resolve local imports relative to file
        if (!/^https?:\/\//i.test(matched)) {
          const resolved = path.resolve(path.dirname(f), matched);
          localFiles.add(resolved);
        } else urls.add(matched);
      }
      // require('...')
      while ((m = REQUIRE_REGEX.exec(content)) !== null) {
        const matched = m[1];
        if (!/^https?:\/\//i.test(matched)) {
          const resolved = path.resolve(path.dirname(f), matched);
          localFiles.add(resolved);
        } else urls.add(matched);
      }
      // any quoted relative paths like '/images/x.png' or '../assets/x.jpg'
      while ((m = RELATIVE_PATH_REGEX.exec(content)) !== null) {
        const matched = m[1];
        if (!/^https?:\/\//i.test(matched)) {
          // try resolve as absolute from frontend root if starts with /
          if (matched.startsWith('/')) {
            const resolved = path.join(FRONTEND_ROOT, matched.replace(/^\//, ''));
            localFiles.add(resolved);
          } else {
            const resolved = path.resolve(path.dirname(f), matched);
            localFiles.add(resolved);
          }
        } else urls.add(matched);
      }
    }

    console.log('Remote URLs found:', urls.size, 'Local files found:', localFiles.size);

    const allFound: string[] = [];
    for (const u of urls) allFound.push(u);
    for (const lf of localFiles) allFound.push(`file://${lf}`);

    // ensure tmp folder exists
    const outDir = path.resolve(__dirname, '../..', 'tmp');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `found_image_urls_${Date.now()}.txt`);
    fs.writeFileSync(outFile, allFound.join('\n'), 'utf-8');
    console.log('Wrote found URLs list to:', outFile);

    if (DRY) {
      console.log('--- DRY RUN: listing first 200 found URLs ---');
      allFound.slice(0, 200).forEach((u, i) => console.log(i + 1, u));
      console.log('DRY RUN complete. No DB changes made.');
      await pool.end();
      return;
    }

    console.log('URLs encontradas:', urls.size);
    let inserted = 0;
    // first handle remote URLs
    for (const url of urls) {
      try {
        console.log('Procesando URL remota:', url);
        const filename = path.basename(new URL(url).pathname);
        const maybeSlug = filename.replace(/\.[^.]+$/, '').replace(/\s+/g, '-').toLowerCase();
        const probe = await probeUrl(url);
        const meta = {
          storage_key: filename,
          url,
          filename,
          mime_type: probe.type,
          size_bytes: probe.size,
          width: null,
          height: null,
        };
        const imageId = await insertImage(pool, meta);
        inserted++;
        console.log('Inserted image id:', imageId, 'from', url);
        const pid = await findProductId(pool, maybeSlug);
        if (pid) {
          await linkProductImage(pool, pid, imageId);
          console.log('Linked to product:', pid);
        }
      } catch (err) {
        console.error('Error procesando URL remota', url, err);
      }
    }

    // then handle local files
    for (const lf of localFiles) {
      try {
        if (!fs.existsSync(lf)) {
          console.warn('Local file not found, skipping:', lf);
          continue;
        }
        console.log('Procesando archivo local:', lf);
        const stat = fs.statSync(lf);
        const filename = path.basename(lf);
        const url = `file://${lf}`;
        const meta = {
          storage_key: filename,
          url,
          filename,
          mime_type: path.extname(filename).replace('.', ''),
          size_bytes: stat.size,
          width: null,
          height: null,
        };
        const imageId = await insertImage(pool, meta);
        inserted++;
        console.log('Inserted image id:', imageId, 'from local file', lf);
        // try link by filename-derived slug
        const maybeSlug = filename.replace(/\.[^.]+$/, '').replace(/\s+/g, '-').toLowerCase();
        const pid = await findProductId(pool, maybeSlug);
        if (pid) {
          await linkProductImage(pool, pid, imageId);
          console.log('Linked to product:', pid);
        }
      } catch (err) {
        console.error('Error procesando archivo local', lf, err);
      }
    }

    console.log('Importación completada. Inserted total:', inserted);

    console.log('Importación completada.');
  } catch (err) {
    console.error('Error en auto-import:', err);
  } finally {
    await pool.end();
  }
}

main();
