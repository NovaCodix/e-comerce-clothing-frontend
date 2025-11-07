# Guía de Integración de Autenticación con Supabase

## ✅ Implementado

### 1. Sistema de Autenticación Completo

El navbar ahora maneja correctamente el flujo de autenticación con Supabase Auth:

#### **Componentes Creados:**

1. **`UserMenu.tsx`** - Menú desplegable del usuario
   - Muestra avatar con iniciales del usuario
   - Opciones dinámicas según estado de autenticación
   - Para usuarios NO autenticados: botón para abrir modal de inicio de sesión
   - Para usuarios autenticados:
     - Ver cuenta
     - Cerrar sesión

2. **`UserAccountModal.tsx`** - Modal de datos del usuario
   - Muestra información del usuario (nombre, email)
   - Permite cambiar contraseña usando `supabase.auth.updateUser()`
   - Se cierra automáticamente al cerrar sesión
   - Validaciones de contraseña (mínimo 6 caracteres)

3. **`useUserData.ts`** - Hook para datos del usuario (ejemplo para futuro uso)
   - Filtrado automático por `user_id`
   - Funciones para pedidos, favoritos y carrito del usuario

### 2. Flujo de Autenticación

#### **Estado Sin Autenticar:**
```
Usuario hace clic en ícono → Muestra modal de login/registro
```

#### **Estado Autenticado:**
```
Usuario hace clic en avatar → Menú desplegable con:
  - Ver cuenta (modal con datos y cambio de contraseña)
  - Cerrar sesión (ejecuta signOut y actualiza estado)
```

### 3. Actualización Automática de UI

El sistema usa `onAuthStateChange` de Supabase para:
- Detectar cambios de sesión en tiempo real
- Actualizar el estado sin recargar la página
- Cerrar modales automáticamente al autenticarse
- Limpiar estado al cerrar sesión

### 4. Integración en Header

**Modificaciones en `Header.tsx`:**
```tsx
import { UserMenu } from "./UserMenu";
import { UserAccountModal } from "./UserAccountModal";
import { useAuthContext } from "../contexts/AuthContext";

// Estados para manejar modales
const [showAccountModal, setShowAccountModal] = useState(false);
const { user } = useAuthContext();

// Desktop
<UserMenu 
  onAccountClick={() => setShowAccountModal(true)}
  onSignInClick={() => onAuthClick()}
/>

// Modal de cuenta
<UserAccountModal 
  open={showAccountModal}
  onClose={() => setShowAccountModal(false)}
/>
```

**Menú Móvil Dinámico:**
```tsx
{user ? (
  // Usuario autenticado: Ver Cuenta, Mis Pedidos
) : (
  // No autenticado: Iniciar Sesión, Seguimiento
)}
```

## 🔐 Funcionalidades de Seguridad

### Cambio de Contraseña
```tsx
const { updatePassword } = useAuthContext();

// En UserAccountModal.tsx
await updatePassword(newPassword);
```

### Cierre de Sesión
```tsx
const { signOut } = useAuthContext();

// En UserMenu.tsx
const handleSignOut = async () => {
  await signOut();
  // El estado se actualiza automáticamente
};
```

## 📊 Filtrado de Datos por Usuario (Preparado para Futuro)

### Hook `useUserData`

Este hook está preparado para cuando configures las tablas en Supabase:

```tsx
import { useUserData } from '../lib/supabase/hooks/useUserData';

function MyComponent() {
  const { 
    user,
    getUserOrders,
    getUserFavorites,
    addFavorite,
    removeFavorite 
  } = useUserData();

  // Obtener pedidos del usuario actual
  const loadOrders = async () => {
    const { data, error } = await getUserOrders();
    if (!error) {
      // Solo pedidos del usuario autenticado
    }
  };
}
```

### Ejemplo de Consultas Filtradas

Todas las consultas incluyen automáticamente filtrado por `user_id`:

```sql
-- Ejemplo: Obtener favoritos
SELECT * FROM favorites 
WHERE user_id = current_user.id;

-- Ejemplo: Obtener pedidos
SELECT * FROM orders 
WHERE user_id = current_user.id
ORDER BY created_at DESC;
```

## 📋 Tablas Sugeridas para Supabase

Para aprovechar al máximo el hook `useUserData`, considera crear estas tablas:

### **1. Tabla `favorites`**
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- RLS (Row Level Security)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
```

### **2. Tabla `cart_items`**
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  size VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### **3. Tabla `orders`**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  estimated_delivery TIMESTAMPTZ
);

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```

## 🎨 Características Visuales

### Avatar con Iniciales
El avatar muestra las iniciales del nombre completo del usuario:
- **Juan Pérez** → **JP**
- **María García** → **MG**

### Estados del Icono de Usuario

1. **No autenticado:** Icono simple de usuario
2. **Autenticado:** Avatar circular con iniciales en color primario

### Feedback Visual
- ✅ Mensajes de éxito al cambiar contraseña
- ❌ Mensajes de error en caso de fallo
- ⏳ Estados de carga durante operaciones

## 🔄 Sincronización de Estado

El `AuthContext` se sincroniza automáticamente con Supabase:

```tsx
useEffect(() => {
  // Obtener sesión actual
  supabase.auth.getSession();

  // Escuchar cambios
  const { subscription } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      // Actualizar estado automáticamente
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

## 📱 Responsive Design

- **Desktop:** Menú desplegable con hover
- **Móvil:** Menú lateral con opciones dinámicas según autenticación

## 🚀 Próximos Pasos Sugeridos

1. **Crear tablas en Supabase** (ver esquemas arriba)
2. **Habilitar RLS** para seguridad
3. **Integrar `useUserData`** en componentes de carrito y favoritos
4. **Agregar foto de perfil** (upload a Supabase Storage)
5. **Implementar recuperación de contraseña** por email

## 🔗 Archivos Modificados/Creados

### Creados:
- `src/components/UserMenu.tsx`
- `src/components/UserAccountModal.tsx`
- `src/lib/supabase/hooks/useUserData.ts`
- `AUTH_INTEGRATION_GUIDE.md` (este archivo)

### Modificados:
- `src/components/Header.tsx`
- `src/components/AuthModal.tsx`

## ✨ Ejemplo de Uso Completo

```tsx
import { useAuthContext } from './contexts/AuthContext';
import { useUserData } from './lib/supabase/hooks/useUserData';

function App() {
  const { user, signOut } = useAuthContext();
  const { getUserOrders, addFavorite } = useUserData();

  // El usuario está autenticado
  if (user) {
    console.log('Usuario:', user.email);
    
    // Obtener pedidos solo del usuario actual
    const orders = await getUserOrders();
    
    // Agregar favorito vinculado al usuario
    await addFavorite(productId);
  }

  return (
    <Header />
  );
}
```

## 💡 Notas Importantes

- ✅ **Todo funciona con Supabase Auth** - No requiere backend adicional
- ✅ **Actualización automática** - Sin necesidad de recargar la página
- ✅ **Seguridad integrada** - RLS de Supabase protege los datos
- ✅ **Persistencia de sesión** - El usuario permanece autenticado entre recargas
- ⚠️ **El hook `useUserData`** requiere que crees las tablas en Supabase primero

---

**¡Listo para usar!** 🎉

El sistema de autenticación está completamente integrado y funcional. Solo necesitas configurar las variables de entorno de Supabase y, opcionalmente, crear las tablas para datos de usuario.
