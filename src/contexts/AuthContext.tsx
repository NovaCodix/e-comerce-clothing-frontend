import { createContext, useContext, ReactNode } from 'react';
import { useAuth as useBackendAuth } from '../lib/supabase/hooks/useAuth';

// Nota: eliminadas dependencias de Supabase. Usamos un hook interno que
// actualmente provee un cliente "sin-auth" para la primera versión sin login.

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  error: any | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useBackendAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
}
