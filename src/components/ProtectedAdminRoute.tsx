import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../lib/supabase/hooks/useAdmin';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: Props) {
  const { isAdmin, loading } = useAdmin();

  // Mientras cargamos, no redirigir (evitar parpadeos)
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Cargando panel de administración...</div>
      </div>
    );
  }

  if (!isAdmin) {
    // No autorizado: redirigir a home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
