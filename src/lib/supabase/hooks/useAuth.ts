import { useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../client';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        error,
      });
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error }));
      return { data: null, error };
    }

    // Crear perfil de usuario
    if (data.user) {
      await (supabase as any).from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName || null,
      });
    }

    setState({
      user: data.user,
      session: data.session,
      loading: false,
      error: null,
    });

    return { data, error: null };
  };

  const signIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error }));
      return { data: null, error };
    }

    // TEMPORALMENTE DESACTIVADO: Validación de is_active
    // Esta validación se activará después de ejecutar la migración 003_admin_system.sql
    /*
    if (data.user) {
      try {
        const { data: profile, error: profileError } = await (supabase as any)
          .from('profiles')
          .select('is_active')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          if (profileError.code === '42703' || profileError.message?.includes('column') || profileError.message?.includes('does not exist')) {
            console.warn('⚠️ Columna is_active no encontrada. Ejecuta la migración 003_admin_system.sql');
          } else if (!profile?.is_active) {
            await supabase.auth.signOut();
            const inactiveError = {
              message: 'Tu cuenta ha sido desactivada. Contacta al administrador.',
              status: 403,
              name: 'InactiveUserError'
            } as AuthError;
            
            setState({
              user: null,
              session: null,
              loading: false,
              error: inactiveError,
            });
            
            return { data: null, error: inactiveError };
          }
        } else if (profile && profile.is_active === false) {
          await supabase.auth.signOut();
          const inactiveError = {
            message: 'Tu cuenta ha sido desactivada. Contacta al administrador.',
            status: 403,
            name: 'InactiveUserError'
          } as AuthError;
          
          setState({
            user: null,
            session: null,
            loading: false,
            error: inactiveError,
          });
          
          return { data: null, error: inactiveError };
        }
      } catch (err) {
        console.warn('Error al verificar estado de usuario, permitiendo login:', err);
      }
    }
    */

    setState({
      user: data.user,
      session: data.session,
      loading: false,
      error: null,
    });

    return { data, error: null };
  };

  const signOut = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const { error } = await supabase.auth.signOut();

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error }));
      return { error };
    }

    setState({
      user: null,
      session: null,
      loading: false,
      error: null,
    });

    return { error: null };
  };

  const signInWithGoogle = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error }));
      return { data: null, error };
    }

    return { data, error: null };
  };

  const resetPassword = async (email: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setState((prev) => ({ ...prev, loading: false, error }));

    return { data, error };
  };

  const updatePassword = async (newPassword: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setState((prev) => ({ ...prev, loading: false, error }));

    return { data, error };
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    resetPassword,
    updatePassword,
  };
}
