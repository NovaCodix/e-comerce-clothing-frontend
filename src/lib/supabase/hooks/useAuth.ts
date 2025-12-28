import { useState } from 'react';

// Hook mínimo de autenticación sin Supabase. Para la primera versión no hay
// autenticación: devolvemos user=null y métodos noop que retornan éxito.

export function useAuth() {
  const [user] = useState<any | null>(null);
  const [session] = useState<any | null>(null);
  const [loading] = useState(false);
  const [error] = useState<any | null>(null);

  const noop = async () => ({ data: null, error: null });

  return {
    user,
    session,
    loading,
    error,
    signUp: noop,
    signIn: noop,
    signOut: async () => ({ error: null }),
    signInWithGoogle: noop,
    resetPassword: noop,
    updatePassword: noop,
  };
}
