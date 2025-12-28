import 'dotenv/config';
import { Pool } from 'pg';
import { URL } from 'url';

// Crawl simple: visita las rutas bajo base URL hasta un límite y extrae <img src=>
// Use global fetch when available (Node 18+). If not present, instruct user to install 'node-fetch'.
declare const fetch: any;

async function probeUrl(url: string) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const size = res.headers.get('content-length');
    const type = res.headers.get('content-type');
    return { size: size ? Number(size) : null, type: type ?? null };
  } catch (e) {
    return { size: null, type: null };
  }
}

async function main() {
  const base = process.argv.find(a => a.startsWith('--base='))?.split('=')[1];
  if (!base) {
    console.error('Uso: npx ts-node src/crawl_and_import_images.ts --base=https://tu-sitio.com [--pages=50]');
    process.exit(1);
  }
  const maxPages = Number(process.argv.find(a => a.startsWith('--pages='))?.split('=')[1] || '50');
  const conn = process.env.DATABASE_URL;
  if (!conn) {
    console.error('Define DATABASE_URL en server/.env');
    process.exit(1);
  }
  const pool = new Pool({ connectionString: conn });
  try {
    const visited = new Set<string>();
    const queue = [base];
    const imgs = new Set<string>();
    while (queue.length && visited.size < maxPages) {
      const url = queue.shift()!;
      if (visited.has(url)) continue;
      console.log('Visiting', url);
      visited.add(url);
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const text = await res.text();
        // extract img src
        const imgRegex = /<img[^>]+src=["']?([^"' >]+)/gi;
        let m: RegExpExecArray | null;
        while ((m = imgRegex.exec(text)) !== null) {
          try {
            const src = m[1];
            const u = new URL(src, url).toString();
            imgs.add(u);
          } catch {}
        }
        // extract links to follow
        const linkRegex = /<a[^>]+href=["']?([^"' >]+)/gi;
        while ((m = linkRegex.exec(text)) !== null) {
          try {
            const href = m[1];
            const u = new URL(href, url);
            if (u.hostname === new URL(base).hostname) {
              const s = u.toString();
              if (!visited.has(s)) queue.push(s);
            }
          } catch {}
        }
      } catch (e: any) {
        console.warn('Visit failed', url, e?.message ?? e);
      }
    }

    console.log('Found images:', imgs.size);
    let inserted = 0;
    for (const img of imgs) {
      try {
        const probe = await probeUrl(img);
        const filename = new URL(img).pathname.split('/').pop() || 'image';
        const res = await pool.query(`INSERT INTO images (storage_key, url, filename, mime_type, size_bytes) VALUES ($1,$2,$3,$4,$5) RETURNING id`, [filename, img, filename, probe.type, probe.size]);
        console.log('Inserted', res.rows[0].id, img);
        inserted++;
      } catch (e: any) {
        console.error('Insert failed for', img, e?.message ?? e);
      }
    }
    console.log('Done. Inserted:', inserted);
  } finally {
    await pool.end();
  }
}

main();
