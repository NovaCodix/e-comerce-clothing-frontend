# 🔐 Instrucciones de Configuración del Sistema de Administración

## ✅ Archivos Creados

El sistema de administración ha sido completamente implementado con los siguientes componentes:

### 1. Base de Datos
- **`supabase/migrations/003_admin_system.sql`**: Migration completa con:
  - Columna `role` en tabla `profiles` (admin/user)
  - Columna `is_active` para desactivación de usuarios (soft delete)
  - Funciones RPC para verificación de admin y gestión de usuarios
  - Vistas con estadísticas de usuarios y carritos
  - Políticas RLS (Row Level Security) para acceso admin-only

### 2. Hooks de React
- **`src/lib/supabase/hooks/useAdmin.ts`**: Hook personalizado con:
  - `isAdmin`: Verificación de rol de administrador
  - `getAllUsers()`: Obtener lista de todos los usuarios
  - `getUserStatistics()`: Estadísticas de usuarios (total, activos, nuevos)
  - `getCartStatistics()`: Métricas del carrito (total items, usuarios con carrito)
  - `deactivateUser()`: Desactivar usuarios
  - `activateUser()`: Reactivar usuarios

### 3. Componentes UI
- **`src/pages/AdminDashboard.tsx`**: Panel de administración completo con:
  - Tarjetas de estadísticas (total usuarios, activos, productos en carrito)
  - Tabla de gestión de usuarios con botones de activar/desactivar
  - Búsqueda y filtrado de usuarios
  - Diseño responsivo con Tailwind CSS

### 4. Integración en la Aplicación
- **`src/App.tsx`**: Ruta `/admin` añadida
- **`src/components/Header.tsx`**: Opción "Administrador" en menú móvil (solo visible para admins)
- **`src/components/UserMenu.tsx`**: Opción "Administrador" en menú de escritorio (solo visible para admins)
- **`src/lib/supabase/hooks/useAuth.ts`**: Validación de cuenta activa en login

---

## 🚀 Pasos de Configuración

### Paso 1: Ejecutar la Migración SQL

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, ve a **SQL Editor**
4. Haz clic en **+ New query**
5. Copia todo el contenido del archivo `supabase/migrations/003_admin_system.sql`
6. Pégalo en el editor SQL
7. Haz clic en **Run** (o presiona Ctrl+Enter)
8. Verifica que la ejecución fue exitosa (debe mostrar "Success. No rows returned")

### Paso 2: Asignar el Primer Administrador

Después de ejecutar la migración, necesitas asignar el rol de administrador a tu cuenta:

1. En Supabase, ve a **SQL Editor** nuevamente
2. Ejecuta la siguiente consulta (reemplaza el email con tu email registrado):

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'tu-email@ejemplo.com';
```

3. Verifica que se actualizó correctamente:

```sql
SELECT id, email, role, is_active, created_at 
FROM public.profiles 
WHERE email = 'tu-email@ejemplo.com';
```

### Paso 3: Verificar la Instalación

1. Abre tu aplicación en el navegador
2. Inicia sesión con la cuenta que configuraste como administrador
3. Haz clic en tu avatar de usuario (esquina superior derecha)
4. Deberías ver la opción **"Administrador"** con un ícono de engranaje y estilo morado/rosa
5. Haz clic en "Administrador" para acceder al panel
6. Deberías ver:
   - Estadísticas de usuarios
   - Tabla con todos los usuarios registrados
   - Botones para activar/desactivar usuarios

---

## 🛡️ Características de Seguridad

### Row Level Security (RLS)
- Solo usuarios con `role = 'admin'` pueden:
  - Ver la lista completa de usuarios
  - Ver estadísticas de usuarios y carritos
  - Activar/desactivar cuentas de usuario
  - Acceder a funciones administrativas

### Desactivación de Cuentas (Soft Delete)
- Los usuarios desactivados **NO** se eliminan de la base de datos
- Al intentar iniciar sesión, usuarios desactivados son rechazados automáticamente
- Los datos del usuario se preservan (para auditoría y posible reactivación)
- La columna `is_active` controla el estado de la cuenta

### Validación en Login
- El hook `useAuth` valida el estado `is_active` después del login
- Si la cuenta está desactivada (`is_active = false`):
  - La sesión se cierra automáticamente
  - Se muestra mensaje: "Tu cuenta ha sido desactivada. Contacta al administrador."

---

## 📊 Funcionalidades del Panel de Administración

### Estadísticas en Tiempo Real
- **Total Usuarios**: Todos los usuarios registrados
- **Usuarios Activos**: Solo usuarios con `is_active = true`
- **Nuevos Usuarios**: Registrados en los últimos 7 días
- **Productos en Carrito**: Total de items en todos los carritos

### Gestión de Usuarios
- **Ver detalles**: Email, nombre, fecha de registro, estado
- **Desactivar cuenta**: Bloquea el acceso del usuario
- **Activar cuenta**: Restaura el acceso del usuario
- **Indicadores visuales**:
  - Badge verde: Usuario activo
  - Badge rojo: Usuario inactivo

---

## 🔍 Verificación de Problemas

### Si no ves la opción "Administrador" en el menú:

1. Verifica que tu cuenta tenga el rol correcto:
```sql
SELECT email, role, is_active FROM public.profiles WHERE email = 'tu-email@ejemplo.com';
```

2. Cierra sesión y vuelve a iniciar sesión
3. Verifica la consola del navegador en busca de errores

### Si ves errores al ejecutar la migración:

1. Verifica que la tabla `profiles` existe:
```sql
SELECT * FROM information_schema.tables WHERE table_name = 'profiles';
```

2. Si la migración falla parcialmente, puedes ejecutar comandos individuales uno por uno

### Si los usuarios desactivados aún pueden iniciar sesión:

1. Verifica que el código de `useAuth.ts` tiene la validación de `is_active`
2. Limpia el caché del navegador y recarga
3. Verifica en Supabase Authentication que la sesión se cerró

---

## 📝 Comandos SQL Útiles

### Ver todos los administradores:
```sql
SELECT email, role, is_active, created_at 
FROM public.profiles 
WHERE role = 'admin';
```

### Ver usuarios inactivos:
```sql
SELECT email, full_name, is_active, updated_at 
FROM public.profiles 
WHERE is_active = false;
```

### Desactivar manualmente un usuario:
```sql
SELECT deactivate_user('user-uuid-aqui');
```

### Activar manualmente un usuario:
```sql
SELECT activate_user('user-uuid-aqui');
```

### Ver estadísticas de usuarios:
```sql
SELECT * FROM user_statistics;
```

### Ver estadísticas de carritos:
```sql
SELECT * FROM cart_statistics;
```

---

## 🎨 Personalización

### Cambiar colores del botón Administrador:

En `UserMenu.tsx` y `Header.tsx`, busca el className del botón Administrador:

```tsx
className="... bg-gradient-to-r from-purple-50 to-pink-50 ..."
```

Puedes cambiar los colores modificando:
- `from-purple-50` y `to-pink-50` (fondo en modo claro)
- `dark:from-purple-950/20` (fondo en modo oscuro)
- `text-purple-600` (color del texto y del ícono)

### Agregar más estadísticas:

En `AdminDashboard.tsx`, puedes agregar nuevas tarjetas de estadísticas:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Tu Estadística</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">{tuValor}</div>
  </CardContent>
</Card>
```

---

## 🆘 Soporte

Si tienes problemas con la configuración:

1. **Revisa la consola del navegador**: Presiona F12 y ve a la pestaña Console
2. **Revisa los logs de Supabase**: En tu dashboard de Supabase → Logs
3. **Verifica las RLS policies**: En Supabase → Authentication → Policies
4. **Prueba las funciones RPC manualmente**: En SQL Editor

---

## ✨ Mejoras Futuras Sugeridas

1. **Paginación**: Para cuando haya muchos usuarios
2. **Búsqueda avanzada**: Filtrar por fecha, email, etc.
3. **Exportar datos**: Descargar lista de usuarios en CSV
4. **Dashboard de ventas**: Integrar con órdenes cuando se implementen
5. **Notificaciones**: Enviar email cuando se desactiva una cuenta
6. **Auditoría**: Registrar todas las acciones administrativas
7. **Roles múltiples**: Agregar roles como 'moderator', 'support', etc.

---

¡El sistema de administración está listo para usar! 🎉
