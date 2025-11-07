# 🚀 Guía de Configuración de Supabase

Esta guía te ayudará a configurar Supabase para tu proyecto de e-commerce.

## 📋 Requisitos Previos

- Cuenta en [Supabase](https://supabase.com)
- Node.js 18+ instalado
- pnpm instalado

## 🔧 Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta
2. Haz clic en "New Project"
3. Completa los datos:
   - **Project name**: e-commerce-clothing (o el nombre que prefieras)
   - **Database password**: Guarda esta contraseña de forma segura
   - **Region**: Selecciona la más cercana a tus usuarios
4. Haz clic en "Create new project"
5. Espera a que el proyecto se inicialice (puede tomar 1-2 minutos)

## 🔑 Paso 2: Obtener las Credenciales

1. En el dashboard de tu proyecto, ve a **Settings** (⚙️) en la barra lateral
2. Haz clic en **API**
3. Encontrarás dos credenciales importantes:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon/public key**: Una clave larga que empieza con `eyJ...`

## 📝 Paso 3: Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Abre `.env.local` y completa las credenciales:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ... (tu clave anon)
   ```

## 🗄️ Paso 4: Crear las Tablas de la Base de Datos

1. En el dashboard de Supabase, ve a **SQL Editor** en la barra lateral
2. Haz clic en **New Query**
3. Copia y pega el contenido de `supabase/migrations/001_initial_schema.sql`
4. Haz clic en **Run** (▶️) para ejecutar el script
5. Verifica que no haya errores (debería aparecer "Success")

## 📊 Paso 5: (Opcional) Agregar Datos de Prueba

1. En el **SQL Editor**, crea una nueva query
2. Copia y pega el contenido de `supabase/migrations/002_seed_data.sql`
3. Haz clic en **Run** (▶️)
4. Verifica que los datos se hayan insertado correctamente

## ✅ Paso 6: Verificar la Configuración

1. Ve a **Table Editor** en la barra lateral de Supabase
2. Deberías ver las siguientes tablas:
   - ✅ profiles
   - ✅ categories
   - ✅ products
   - ✅ favorites
   - ✅ cart_items
   - ✅ orders
   - ✅ order_items
   - ✅ reviews

## 🚀 Paso 7: Ejecutar el Proyecto

```bash
pnpm install
pnpm dev
```

Tu aplicación debería estar corriendo en `http://localhost:5173`

## 🔐 Configuración de Autenticación (Opcional)

### Habilitar Google OAuth

1. En el dashboard de Supabase, ve a **Authentication** → **Providers**
2. Busca **Google** y haz clic en editar
3. Habilita el provider
4. Configura con tus credenciales de Google Cloud Console
5. Agrega `http://localhost:5173` a las **Redirect URLs**

### Configurar Email (Ya está habilitado por defecto)

El email authentication ya está configurado. Los usuarios recibirán un correo de confirmación al registrarse.

## 🧪 Probar la Aplicación

1. **Registrar usuario**:
   - Haz clic en el botón de login/registro
   - Crea una cuenta con tu email
   - Verifica tu correo (revisa spam si no lo ves)

2. **Iniciar sesión**:
   - Usa tus credenciales para iniciar sesión

3. **Agregar productos al carrito**:
   - Navega por los productos
   - Agrega items al carrito
   - El carrito se sincroniza automáticamente con Supabase

4. **Crear un pedido**:
   - Ve al carrito
   - Completa el proceso de checkout
   - Revisa tus pedidos en el tracker

## 🔧 Estructura de la Base de Datos

```
┌─────────────┐
│   profiles  │ ← Información de usuarios
└─────────────┘
       │
       ├─► cart_items ← Carrito de compras
       ├─► favorites  ← Productos favoritos
       ├─► orders     ← Pedidos realizados
       └─► reviews    ← Reseñas de productos

┌─────────────┐
│  categories │ ← Categorías de productos
└─────────────┘
       │
       └─► products ← Productos disponibles
              │
              ├─► favorites
              ├─► cart_items
              ├─► order_items
              └─► reviews
```

## 🛡️ Seguridad (Row Level Security)

Todas las tablas tienen Row Level Security (RLS) habilitado:

- ✅ Los usuarios solo pueden ver/editar sus propios datos
- ✅ Los productos y categorías son públicos (solo lectura)
- ✅ Los pedidos están protegidos por usuario
- ✅ Los items del carrito son privados por usuario

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Solución de Problemas

### Error: "Invalid API key"
- Verifica que hayas copiado correctamente las credenciales
- Asegúrate de estar usando la **anon key**, no la service_role key

### Error: "Failed to fetch"
- Verifica que la URL de Supabase sea correcta
- Asegúrate de tener conexión a internet
- Revisa que el proyecto de Supabase esté activo

### No se crean las tablas
- Verifica que hayas ejecutado el script SQL completo
- Revisa el panel de errores en el SQL Editor
- Asegúrate de que no haya errores de sintaxis

### Los usuarios no pueden registrarse
- Ve a Authentication → Email Templates y verifica la configuración
- Revisa que el email SMTP esté configurado (Supabase proporciona uno por defecto)
- Verifica que no haya errores en la consola del navegador

## 📞 Soporte

Si tienes problemas, revisa:
1. Los logs en la consola del navegador (F12)
2. Los logs en Supabase Dashboard → Logs
3. La documentación oficial de Supabase

---

¡Listo! Tu e-commerce está completamente configurado con Supabase 🎉
