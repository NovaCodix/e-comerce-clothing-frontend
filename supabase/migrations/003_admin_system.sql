-- =====================================================
-- SISTEMA DE ADMINISTRACIÓN Y ROLES
-- =====================================================

-- 1. Agregar columna de rol y estado a profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Crear tabla de roles permitidos
CREATE TABLE IF NOT EXISTS public.user_roles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar roles por defecto
INSERT INTO public.user_roles (name, description) VALUES
  ('admin', 'Administrador con acceso completo al sistema'),
  ('user', 'Usuario regular de la tienda')
ON CONFLICT (name) DO NOTHING;

-- 3. Crear tabla de reportes/analytics
CREATE TABLE IF NOT EXISTS public.analytics_reports (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  report_type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by UUID REFERENCES auth.users(id)
);

-- 4. Crear función para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id 
    AND role = 'admin' 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Crear función para obtener usuarios activos
CREATE OR REPLACE FUNCTION public.get_active_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.is_active,
    p.created_at
  FROM public.profiles p
  WHERE public.is_admin(auth.uid())
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Políticas de seguridad para profiles
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.profiles;

CREATE POLICY "Los usuarios pueden ver perfiles"
ON public.profiles FOR SELECT
USING (
  id = auth.uid() OR 
  public.is_admin(auth.uid())
);

CREATE POLICY "Los usuarios pueden actualizar su perfil"
ON public.profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Los admins pueden actualizar cualquier perfil"
ON public.profiles FOR UPDATE
USING (public.is_admin(auth.uid()));

-- 7. Políticas para analytics_reports
ALTER TABLE public.analytics_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo admins pueden ver reportes"
ON public.analytics_reports FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden crear reportes"
ON public.analytics_reports FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- 8. Crear vista de estadísticas de usuarios
CREATE OR REPLACE VIEW public.user_statistics AS
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE is_active = true) as active_users,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_users,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users_month
FROM public.profiles;

-- 9. Crear vista de estadísticas de productos en carritos
CREATE OR REPLACE VIEW public.cart_statistics AS
SELECT 
  COUNT(DISTINCT user_id) as users_with_cart,
  SUM(quantity) as total_items_in_carts,
  COUNT(*) as total_cart_entries
FROM public.cart_items;

-- 10. Función para desactivar usuario (NO eliminarlo)
CREATE OR REPLACE FUNCTION public.deactivate_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Solo admins pueden desactivar usuarios
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'No tienes permisos para esta acción';
  END IF;

  -- No permitir que un admin se desactive a sí mismo
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'No puedes desactivarte a ti mismo';
  END IF;

  UPDATE public.profiles
  SET is_active = false, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Función para activar usuario
CREATE OR REPLACE FUNCTION public.activate_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'No tienes permisos para esta acción';
  END IF;

  UPDATE public.profiles
  SET is_active = true, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Trigger para validar que el usuario esté activo al iniciar sesión
-- Esto se maneja en el cliente, pero podemos crear una función helper
CREATE OR REPLACE FUNCTION public.check_user_active()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Crear el primer usuario admin
-- IMPORTANTE: Cambia este email por el tuyo
-- Ejecuta esto DESPUÉS de crear tu primera cuenta en la aplicación
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';

COMMENT ON FUNCTION public.is_admin IS 'Verifica si un usuario tiene rol de administrador y está activo';
COMMENT ON FUNCTION public.deactivate_user IS 'Desactiva un usuario (no lo elimina de la base de datos)';
COMMENT ON FUNCTION public.activate_user IS 'Reactiva un usuario previamente desactivado';
COMMENT ON VIEW public.user_statistics IS 'Estadísticas generales de usuarios para el panel admin';
COMMENT ON VIEW public.cart_statistics IS 'Estadísticas de carritos de compra para el panel admin';
