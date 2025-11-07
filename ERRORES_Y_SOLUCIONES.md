# 🔧 Errores Comunes y Soluciones

## 📋 Estado Actual

Actualmente estás viendo estos errores en la consola porque **las migraciones SQL no se han ejecutado aún en Supabase**. Esto es completamente normal y esperado.

---

## ⚠️ Errores Actuales (Antes de ejecutar las migraciones)

### 1. Error 404: `is_admin` not found

```
Failed to load resource: the server responded with a status of 404
rpc/is_admin
```

**Causa**: La función RPC `is_admin()` no existe en Supabase porque no has ejecutado la migración `003_admin_system.sql` aún.

**Impacto**: 
- ❌ No puedes acceder al panel de administración
- ✅ La aplicación funciona normalmente (solo no verás la opción "Administrador")

**Solución**: 
1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta el contenido de `supabase/migrations/003_admin_system.sql`
3. Recarga la página

**Mientras tanto**: El hook `useAdmin.ts` ahora muestra una advertencia en lugar de un error:
```
⚠️ Función is_admin no encontrada. Ejecuta la migración 003_admin_system.sql en Supabase.
```

---

### 2. Error 400: Bad Request (cart_items)

```
Failed to load resource: the server responded with a status of 400
```

**Causa**: La tabla `cart_items` probablemente no existe o tiene un esquema diferente al esperado.

**Impacto**: 
- ❌ El carrito no se guarda en la base de datos
- ✅ El carrito funciona usando localStorage (como fallback)

**Solución**:
Ejecutar la migración de la base de datos. Verifica que la migración inicial incluya:

```sql
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Mientras tanto**: El hook `useCart.ts` ahora usa localStorage automáticamente si la tabla no existe:
```
⚠️ Tabla cart_items no encontrada. El carrito usará localStorage.
```

---

### 3. Warning: DialogContent accessibility

```
`DialogContent` requires a `DialogTitle` for the component to be accessible
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.
```

**Causa**: Radix UI requiere títulos y descripciones para accesibilidad.

**Impacto**: 
- ✅ La aplicación funciona normalmente
- ⚠️ Puede afectar la accesibilidad para lectores de pantalla

**Estado**: ✅ **YA CORREGIDO** - El componente `ProductDetailModal.tsx` ya tiene `DialogTitle` y `DialogDescription`.

**Si aún ves el warning**: Puede ser de otro componente. Busca en el código componentes que usen `<Dialog>` sin `<DialogTitle>`.

---

## ✅ Soluciones Implementadas

### 1. Manejo Graceful de Errores en `useAdmin.ts`

**Antes**:
```typescript
if (error) throw error; // ❌ Crasheaba la app
```

**Ahora**:
```typescript
if (error) {
  // Si la función RPC no existe aún
  if (error.code === 'PGRST202' || error.message?.includes('not found')) {
    console.warn('⚠️ Función is_admin no encontrada...');
    setIsAdmin(false); // ✅ Simplemente no muestra panel admin
    return;
  }
  throw error;
}
```

---

### 2. Fallback a localStorage en `useCart.ts`

**Antes**:
```typescript
if (error) throw error; // ❌ Crasheaba la app
```

**Ahora**:
```typescript
if (error) {
  // Si la tabla no existe
  if (error.code === '42P01' || error.message?.includes('does not exist')) {
    console.warn('⚠️ Tabla cart_items no encontrada. Usando localStorage.');
    loadCartFromLocalStorage(); // ✅ Usa localStorage como fallback
    return;
  }
  throw error;
}
```

---

### 3. Validación de usuarios activos en `useAuth.ts`

**Implementado**:
```typescript
// Después del login exitoso, verificar si el usuario está activo
const { data: profile } = await supabase
  .from('profiles')
  .select('is_active')
  .eq('id', data.user.id)
  .single();

if (!profile?.is_active) {
  await supabase.auth.signOut();
  return { error: 'Cuenta desactivada' };
}
```

---

## 🚀 Pasos para Eliminar TODOS los Errores

### Paso 1: Ejecutar Migración de Admin (⚠️ CRÍTICO)

1. Abre [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **SQL Editor**
3. Crea una **New Query**
4. Copia TODO el contenido de: `supabase/migrations/003_admin_system.sql`
5. Pega y ejecuta (Run)

**Esto creará**:
- ✅ Función `is_admin()`
- ✅ Funciones `deactivate_user()` y `activate_user()`
- ✅ Vista `user_statistics`
- ✅ Vista `cart_statistics`
- ✅ Columnas `role` y `is_active` en tabla `profiles`

---

### Paso 2: Verificar/Crear Tabla cart_items

Verifica que la tabla existe:
```sql
SELECT * FROM cart_items LIMIT 1;
```

Si no existe, créala:
```sql
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Habilitar RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver/editar su propio carrito
CREATE POLICY "Users can manage their own cart"
ON cart_items
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

---

### Paso 3: Asignar Primer Administrador

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'tu-email@ejemplo.com';
```

---

### Paso 4: Verificar Tabla profiles

Asegúrate de que la tabla `profiles` tenga todas las columnas necesarias:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
```

Deberías ver:
- `id` (uuid)
- `email` (text)
- `full_name` (text)
- `role` (text) ← **Debe existir después de la migración**
- `is_active` (boolean) ← **Debe existir después de la migración**
- `created_at` (timestamp)
- `updated_at` (timestamp) ← **Debe existir después de la migración**

---

## 🔍 Verificación Post-Migración

### 1. Verificar que is_admin funciona:
```sql
SELECT is_admin();
```
Debería retornar `true` o `false` (no un error).

### 2. Verificar estadísticas de usuarios:
```sql
SELECT * FROM user_statistics;
```

### 3. Verificar estadísticas de carritos:
```sql
SELECT * FROM cart_statistics;
```

### 4. Verificar tu rol:
```sql
SELECT id, email, role, is_active FROM profiles WHERE email = 'tu-email@ejemplo.com';
```

---

## 📊 Estado Esperado DESPUÉS de las Migraciones

### Consola del Navegador - ANTES:
```
❌ Failed to load resource: 404 (is_admin)
❌ Error checking admin status
❌ Failed to load resource: 400 (cart_items)
❌ Error al cargar carrito
```

### Consola del Navegador - DESPUÉS:
```
✅ Carrito cargado desde BD
✅ (Sin errores de is_admin)
✅ (Sin errores de cart_items)
```

---

## 🛠️ Comandos SQL Útiles para Debugging

### Ver todas las funciones RPC creadas:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION';
```

### Ver todas las vistas creadas:
```sql
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';
```

### Ver todas las políticas RLS:
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Eliminar y recrear la función is_admin (si hay problemas):
```sql
DROP FUNCTION IF EXISTS is_admin();

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🎯 Resumen de Prioridades

| Prioridad | Tarea | Estado |
|-----------|-------|--------|
| 🔴 ALTA | Ejecutar `003_admin_system.sql` | ⏳ Pendiente |
| 🟡 MEDIA | Verificar/crear tabla `cart_items` | ⏳ Pendiente |
| 🟡 MEDIA | Asignar primer administrador | ⏳ Pendiente |
| 🟢 BAJA | Warnings de accesibilidad Dialog | ✅ Resuelto |

---

## 💡 Tips Adicionales

1. **Siempre ejecuta las migraciones en orden**: 001, 002, 003, etc.
2. **Haz backup antes de cambios grandes**: Supabase → Database → Backups
3. **Usa transacciones para cambios importantes**:
   ```sql
   BEGIN;
   -- tus cambios aquí
   COMMIT; -- o ROLLBACK si algo salió mal
   ```
4. **Verifica los logs de Supabase**: Dashboard → Logs → Database
5. **Usa el modo de desarrollo con CORS habilitado** en Supabase

---

## 🆘 Si Nada Funciona

1. **Revisa las políticas RLS**: Puede que estén bloqueando el acceso
2. **Verifica las credenciales de Supabase** en `.env` o donde estén configuradas
3. **Limpia el caché del navegador**: Ctrl + Shift + Delete
4. **Cierra sesión y vuelve a iniciar sesión**
5. **Revisa los logs del servidor**: Supabase Dashboard → Logs

---

¡Una vez ejecutes las migraciones, todos estos errores desaparecerán! 🎉
