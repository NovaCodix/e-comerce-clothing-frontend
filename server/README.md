Servidor de ejemplo para subida de imágenes (presigned URLs)

Instrucciones rápidas:

1. Copia `.env.example` a `.env` y completa `DATABASE_URL`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` y opcionales `S3_ENDPOINT` y `CDN_BASE_URL`.

2. Instala dependencias dentro de la carpeta `server`:

```bash
cd server
pnpm install
```

3. Ejecuta el servidor:

```bash
pnpm run start
# o en desarrollo con nodemon
pnpm run dev
```

Endpoints:
- `POST /api/upload/presign` { filename, mimeType, folder? } -> { url, key }
- `PUT` subir directamente el archivo al `url` devuelto (Content-Type: mimeType)
- `POST /api/upload/complete` { key, filename, mimeType, width, height, sizeBytes, uploaded_by? } -> guarda metadata en Postgres

Notas:
- Este servidor es un ejemplo mínimo; para producción añade validaciones, limitación de tamaño y protección.
- Para desarrollo local puedes usar MinIO y apuntar `S3_ENDPOINT`.
