# 🛍️ E-Commerce de Ropa - Frontend

Una aplicación moderna de e-commerce para ropa, construida con React, TypeScript, Tailwind CSS y Supabase.

## ✨ Características

- 🔐 **Autenticación completa** con Supabase (email/password + Google OAuth)
- 🛒 **Carrito de compras persistente** sincronizado en tiempo real
- ❤️ **Sistema de favoritos** por usuario
- 📦 **Gestión de pedidos** con tracking
- 🔍 **Búsqueda y filtros** de productos
- 📱 **Diseño responsive** adaptado a móviles, tablets y desktop
- ⚡ **Performance optimizada** con Vite y React
- 🎨 **UI moderna** con Tailwind CSS y Radix UI
- 🔒 **Seguridad** con Row Level Security (RLS) de Supabase

## 🚀 Tecnologías

- **Frontend**: React 18, TypeScript, Vite
- **Estilos**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Rutas**: React Router DOM
- **Iconos**: Lucide React
- **Animaciones**: Framer Motion
- **Formularios**: React Hook Form

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/e-commerce-clothing-frontend.git
cd e-commerce-clothing-frontend
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar Supabase

Sigue la guía completa en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Resumen rápido**:
1. Crea un proyecto en [Supabase](https://supabase.com)
2. Copia `.env.example` a `.env.local`
3. Agrega tus credenciales de Supabase
4. Ejecuta los scripts SQL de `supabase/migrations/`

### 4. Ejecutar el proyecto

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React reutilizables
│   ├── ui/              # Componentes de UI base (Radix UI)
│   ├── AuthModal.tsx    # Modal de autenticación
│   ├── CartDrawer.tsx   # Drawer del carrito
│   ├── Header.tsx       # Navegación principal
│   └── ...
├── lib/
│   └── supabase/        # Configuración de Supabase
│       ├── client.ts    # Cliente de Supabase
│       ├── types.ts     # Tipos de la base de datos
│       ├── hooks/       # Hooks personalizados
│       │   ├── useAuth.ts
│       │   ├── useCart.ts
│       │   └── useProducts.ts
│       └── services/    # Servicios de la API
│           ├── authService.ts
│           ├── cartService.ts
│           ├── orderService.ts
│           └── ...
├── pages/               # Páginas principales
│   ├── Home.tsx
│   ├── Collection.tsx
│   └── OrderTrackerPage.tsx
└── styles/              # Estilos globales
    └── globals.css

supabase/
└── migrations/          # Scripts SQL de base de datos
    ├── 001_initial_schema.sql
    └── 002_seed_data.sql
```

## 🗄️ Base de Datos

### Tablas principales:

- **profiles**: Perfiles de usuario extendiendo auth.users
- **categories**: Categorías de productos
- **products**: Catálogo de productos
- **cart_items**: Items en el carrito de cada usuario
- **favorites**: Productos favoritos por usuario
- **orders**: Pedidos realizados
- **order_items**: Items de cada pedido
- **reviews**: Reseñas de productos

Todas las tablas tienen **Row Level Security (RLS)** habilitado para proteger los datos de los usuarios.

## 🔐 Autenticación

La aplicación soporta:

- ✅ Registro con email y contraseña
- ✅ Login con email y contraseña
- ✅ Login con Google OAuth
- ✅ Recuperación de contraseña
- ✅ Verificación de email
- ✅ Sesiones persistentes

## 🛒 Funcionalidades del Carrito

- Agregar/eliminar productos
- Actualizar cantidades
- Seleccionar tallas y colores
- Cálculo automático de totales
- Sincronización en tiempo real con Supabase
- Persistencia entre sesiones

## 📦 Sistema de Pedidos

- Creación de pedidos desde el carrito
- Tracking con número de seguimiento
- Estados: pending, processing, shipped, delivered, cancelled
- Historial completo de pedidos por usuario
- Detalles de envío y pago

## 🎨 Personalización

### Colores y Tema

Edita `src/styles/globals.css` para personalizar los colores:

```css
:root {
  --primary: ...;
  --secondary: ...;
  /* ... más variables */
}
```

### Logo y Branding

Reemplaza `/public/logo.svg` con tu propio logo.

## 🧪 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Información de base de datos
pnpm db:info
```

## 🔒 Seguridad

- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Validación de datos en el frontend
- ✅ Tokens JWT para autenticación
- ✅ HTTPS en producción
- ✅ Sanitización de inputs

## 🚀 Despliegue

### Vercel (Recomendado)

1. Haz push de tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Agrega las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Despliega

### Netlify

1. Conecta tu repositorio
2. Build command: `pnpm build`
3. Publish directory: `dist`
4. Agrega las variables de entorno

## 📝 Variables de Entorno

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Ver `.env.example` para más detalles.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

- 📧 Email: tu-email@ejemplo.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/e-commerce-clothing-frontend/issues)
- 📚 Docs: [Documentación](./SUPABASE_SETUP.md)

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) por el backend
- [Radix UI](https://www.radix-ui.com/) por los componentes
- [Tailwind CSS](https://tailwindcss.com/) por los estilos
- [Lucide](https://lucide.dev/) por los iconos

---

Hecho con ❤️ por [Tu Nombre]
