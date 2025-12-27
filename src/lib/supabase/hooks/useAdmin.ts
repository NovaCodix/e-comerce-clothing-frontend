import { useEffect, useState, useRef } from 'react';
import { supabase } from '../client';
import { useAuthContext } from '../../../contexts/AuthContext';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface UserStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  admin_users: number;
  new_users_month: number;
}

export interface CartStatistics {
  users_with_cart: number;
  total_items_in_carts: number;
  total_cart_entries: number;
}

// Variable global para cachear el estado de admin y evitar llamadas repetidas
let adminCheckCache: { userId: string | null; isAdmin: boolean; checked: boolean } = {
  userId: null,
  isAdmin: false,
  checked: false
};

export function useAdmin() {
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Solo verificar si el usuario cambió o no se ha verificado aún
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      adminCheckCache = { userId: null, isAdmin: false, checked: true };
      hasChecked.current = true;
      return;
    }

    // Si ya tenemos el resultado en caché para este usuario, usarlo
    if (adminCheckCache.userId === user.id && adminCheckCache.checked) {
      setIsAdmin(adminCheckCache.isAdmin);
      setLoading(false);
      hasChecked.current = true;
      return;
    }

    // Si ya verificamos en este componente, no volver a verificar
    if (hasChecked.current && adminCheckCache.userId === user.id) {
      return;
    }

    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Evitar llamadas duplicadas
    if (hasChecked.current && adminCheckCache.userId === user.id) {
      return;
    }

    try {
      const { data, error } = await (supabase as any).rpc('is_admin', {
        user_id: user.id
      });

      if (error) {
        // Si la función RPC no existe aún, intentar fallback: leer role desde profiles
        if (error.code === 'PGRST202' || error.message?.includes('not found') || error.message?.includes('does not exist')) {
          // Advertencia informativa solo la primera vez
          if (!adminCheckCache.checked) {
            console.warn('⚠️ Sistema de administración no configurado. Intentando fallback a `profiles.role`. Lee EJECUTAR_MIGRACION_AHORA.md');
          }

          try {
            // Intentar leer role directamente desde profiles como fallback
            const { data: profileData, error: profileError } = await (supabase as any)
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .maybeSingle();

            if (!profileError && profileData && profileData.role === 'admin') {
              setIsAdmin(true);
              adminCheckCache = { userId: user.id, isAdmin: true, checked: true };
              hasChecked.current = true;
              setLoading(false);
              return;
            }

            // Si hubo error en el select (RLS) o no es admin, marcar como no admin
            if (profileError) {
              // Evitar spam en consola
              if (!adminCheckCache.checked) {
                console.warn('⚠️ No se pudo leer `profiles.role` (RLS o ausencia). Ejecuta la migración para habilitar el admin.');
              }
            }

            setIsAdmin(false);
            adminCheckCache = { userId: user.id, isAdmin: false, checked: true };
            hasChecked.current = true;
            setLoading(false);
            return;
          } catch (innerError) {
            // Fallback falló, seguir sin admin
            if (!adminCheckCache.checked) {
              console.warn('⚠️ Fallback a profiles.role falló. Ejecuta la migración 003_admin_system.sql');
            }
            setIsAdmin(false);
            adminCheckCache = { userId: user.id, isAdmin: false, checked: true };
            hasChecked.current = true;
            setLoading(false);
            return;
          }
        }

        throw error;
      }

      const adminStatus = data === true;
      setIsAdmin(adminStatus);
      adminCheckCache = { userId: user.id, isAdmin: adminStatus, checked: true };
      hasChecked.current = true;
    } catch (error) {
      // Solo loguear errores inesperados, no los 404
      if (!error || !(error as any).message?.includes('not found')) {
        console.error('Error checking admin status:', error);
      }
      setIsAdmin(false);
      adminCheckCache = { userId: user.id, isAdmin: false, checked: true };
      hasChecked.current = true;
    } finally {
      setLoading(false);
    }
  };

  const getAllUsers = async (): Promise<AdminUser[]> => {
    try {
      const { data, error } = await (supabase as any).rpc('get_active_users');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  const getUserStatistics = async (): Promise<UserStatistics | null> => {
    try {
      const { data, error } = await (supabase as any)
        .from('user_statistics')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user statistics:', error);
      return null;
    }
  };

  const getCartStatistics = async (): Promise<CartStatistics | null> => {
    try {
      const { data, error } = await (supabase as any)
        .from('cart_statistics')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting cart statistics:', error);
      return null;
    }
  };

  const deactivateUser = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await (supabase as any).rpc('deactivate_user', {
        target_user_id: userId
      });

      if (error) throw error;
      return data === true;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  };

  const activateUser = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await (supabase as any).rpc('activate_user', {
        target_user_id: userId
      });

      if (error) throw error;
      return data === true;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  };

  return {
    isAdmin,
    loading,
    getAllUsers,
    getUserStatistics,
    getCartStatistics,
    deactivateUser,
    activateUser,
  };
}
