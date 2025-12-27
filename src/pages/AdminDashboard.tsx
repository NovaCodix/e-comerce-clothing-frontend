import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin, AdminUser, UserStatistics, CartStatistics } from '../lib/supabase/hooks/useAdmin';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  UserX, 
  UserCheck,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, loading, getAllUsers, getUserStatistics, getCartStatistics, deactivateUser, activateUser } = useAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const [cartStats, setCartStats] = useState<CartStatistics | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/');
    }
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [usersData, userStatsData, cartStatsData] = await Promise.all([
        getAllUsers(),
        getUserStatistics(),
        getCartStatistics(),
      ]);

      setUsers(usersData);
      setUserStats(userStatsData);
      setCartStats(cartStatsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Error al cargar datos del panel');
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeactivateUser = async (userId: string, userName: string) => {
    if (!confirm(`¿Estás seguro de desactivar a ${userName}?`)) return;

    try {
      await deactivateUser(userId);
      toast.success('Usuario desactivado exitosamente');
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Error al desactivar usuario');
    }
  };

  const handleActivateUser = async (userId: string, userName: string) => {
    try {
      await activateUser(userId);
      toast.success('Usuario activado exitosamente');
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Error al activar usuario');
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b8a89a]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la tienda
          </Button>
          
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#b8a89a]" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
              <p className="text-muted-foreground">Gestiona usuarios y visualiza estadísticas</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#b8a89a]" />
                <span className="text-3xl font-bold">
                  {userStats?.total_users || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Usuarios Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                <span className="text-3xl font-bold text-green-600">
                  {userStats?.active_users || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Usuarios con Carrito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#b8a89a]" />
                <span className="text-3xl font-bold">
                  {cartStats?.users_with_cart || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nuevos (30 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-3xl font-bold text-blue-600">
                  {userStats?.new_users_month || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>
              Lista de todos los usuarios registrados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b8a89a]"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.full_name || 'Sin nombre'}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Admin' : 'Usuario'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'default' : 'destructive'}>
                            {user.is_active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.role !== 'admin' && (
                            user.is_active ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeactivateUser(user.id, user.full_name || user.email)}
                              >
                                <UserX className="w-4 h-4 mr-2" />
                                Desactivar
                              </Button>
                            ) : (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleActivateUser(user.id, user.full_name || user.email)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activar
                              </Button>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
