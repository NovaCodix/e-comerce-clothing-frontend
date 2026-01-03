import { useState, useEffect } from 'react';

// Hook admin actualizado: verifica si el usuario está autenticado vía JWT
export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si existe el token JWT en localStorage
    const token = localStorage.getItem('adminToken');
    const authenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    
    // Solo está autenticado si tiene ambos
    setIsAdmin(authenticated && !!token);
    setLoading(false);
  }, []);

  // Función para obtener el token (útil para hacer peticiones)
  const getToken = () => localStorage.getItem('adminToken');

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminAuthenticated');
    setIsAdmin(false);
  };

  const noopArray = async () => [];
  const noopNull = async () => null;
  const noopBool = async () => false;

  return {
    isAdmin,
    loading,
    getToken,
    logout,
    getAllUsers: noopArray,
    getUserStatistics: noopNull,
    getCartStatistics: noopNull,
    deactivateUser: noopBool,
    activateUser: noopBool,
  };
}
