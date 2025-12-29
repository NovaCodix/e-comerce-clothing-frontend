Aquí tienes la documentación completa y unificada. Copia y pega esto en un archivo llamado README.md en la carpeta raíz de tu proyecto.

Markdown

# 🛍️ Guía de Desarrollo - E-commerce Clothing

Documentación simplificada para ejecutar el proyecto en entorno local (Frontend + Backend + Base de Datos).

## 📋 1. Requisitos Previos
* **Node.js** (v18 o superior).
* **PostgreSQL** (Instalado y corriendo).
* **pnpm** (Instalar con `npm i -g pnpm`).

---

## ⚙️ 2. Instalación Inicial (Solo la primera vez)

### A. Instalar Dependencias
Abre una terminal en la carpeta raíz y ejecuta:

```bash
# 1. Instalar dependencias del Frontend
pnpm install

# 2. Instalar dependencias del Backend
cd server
pnpm install
B. Configurar Base de Datos
Ve a la carpeta server/ y crea un archivo llamado .env.

Pega el siguiente contenido (ajusta tu usuario y contraseña de Postgres):

Fragmento de código

PORT=4000
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/nombre_tu_bd?schema=public"
Crea las tablas en la base de datos ejecutando este comando dentro de server/:

Bash

npx prisma migrate dev --name init
🚀 3. Cómo arrancar el proyecto (Día a día)
Para que la tienda funcione, necesitas tener DOS terminales abiertas al mismo tiempo.

Terminal 1: EL BACKEND (Servidor y Base de Datos)
Mantiene la conexión con la base de datos y sirve las imágenes.

Bash

cd server
pnpm dev
Debe aparecer: 🚀 Servidor listo en http://localhost:4000

Terminal 2: EL FRONTEND (Página Web)
Muestra la tienda visualmente.

Bash

# Asegúrate de estar en la carpeta raíz (e-comerce-clothing-frontend)
pnpm dev
Debe aparecer: Local: http://localhost:5173/

🛠️ 4. Administración
Para agregar productos, subir fotos y crear categorías, ingresa a la siguiente ruta en tu navegador (con ambos servidores encendidos):

👉 http://localhost:5173/admin/create-product