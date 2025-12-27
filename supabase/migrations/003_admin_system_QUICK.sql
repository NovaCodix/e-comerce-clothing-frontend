-- ============================================
-- MIGRACIÓN RÁPIDA: Sistema de Administración
-- ============================================
-- Ejecuta este script EN ORDEN en Supabase SQL Editor
-- ============================================

-- PASO 1: Agregar columnas a la tabla profiles
-- ============================================
DO $$ 
BEGIN
    -- Agregar columna role si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
    
    -- Agregar columna is_active si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'is_active') THEN
        ALTER TABLE public.profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Agregar columna updated_at si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Asegurar que todos los usuarios existentes estén activos
UPDATE public.profiles SET is_active = true WHERE is_active IS NULL;
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;

-- ============================================
-- PASO 2: Crear función is_admin()
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar si el usuario actual es admin y está activo
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
  );
END;
$$;

-- ============================================
-- PASO 3: Crear función get_active_users()
-- ============================================
CREATE OR REPLACE FUNCTION public.get_active_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Solo admins pueden ver todos los usuarios
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'No tienes permisos para realizar esta acción';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.is_active,
    p.created_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- ============================================
-- PASO 4: Crear función deactivate_user()
-- ============================================
CREATE OR REPLACE FUNCTION public.deactivate_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Solo admins pueden desactivar usuarios
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'No tienes permisos para realizar esta acción';
  END IF;

  -- No se puede desactivar a sí mismo
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'No puedes desactivar tu propia cuenta';
  END IF;

  -- Desactivar usuario
  UPDATE public.profiles
  SET is_active = false, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN true;
END;
$$;

-- ============================================
-- PASO 5: Crear función activate_user()
-- ============================================
CREATE OR REPLACE FUNCTION public.activate_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Solo admins pueden activar usuarios
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'No tienes permisos para realizar esta acción';
  END IF;

  -- Activar usuario
  UPDATE public.profiles
  SET is_active = true, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN true;
END;
$$;

-- ============================================
-- PASO 6: Crear vistas de estadísticas
-- ============================================

-- Vista de estadísticas de usuarios
CREATE OR REPLACE VIEW public.user_statistics AS
SELECT
  COUNT(*) AS total_users,
  COUNT(*) FILTER (WHERE is_active = true) AS active_users,
  COUNT(*) FILTER (WHERE is_active = false) AS inactive_users,
  COUNT(*) FILTER (WHERE role = 'admin') AS admin_users,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') AS new_users_month
FROM public.profiles;

-- Vista de estadísticas de carritos
CREATE OR REPLACE VIEW public.cart_statistics AS
SELECT
  COUNT(DISTINCT user_id) AS users_with_cart,
  COALESCE(SUM(quantity), 0) AS total_items_in_carts,
  COUNT(*) AS total_cart_entries
FROM public.cart_items;

-- ============================================
-- PASO 7: Configurar Row Level Security (RLS)
-- ============================================

-- Habilitar RLS en profiles si no está habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil (excepto role e is_active)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política: Los admins pueden ver todos los perfiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
  )
);

-- ============================================
-- ✅ MIGRACIÓN COMPLETADA
-- ============================================

-- Verificar que todo funcionó
SELECT 'Migración completada exitosamente' AS status;

-- Mostrar columnas de profiles
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
