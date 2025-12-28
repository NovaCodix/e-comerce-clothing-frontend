import { useState } from 'react';

// Hook admin simplificado: no hay sistema de admin en la primera versión.
export function useAdmin() {
  const [isAdmin] = useState(false);
  const [loading] = useState(false);

  const noopArray = async () => [];
  const noopNull = async () => null;
  const noopBool = async () => false;

  return {
    isAdmin,
    loading,
    getAllUsers: noopArray,
    getUserStatistics: noopNull,
    getCartStatistics: noopNull,
    deactivateUser: noopBool,
    activateUser: noopBool,
  };
}
