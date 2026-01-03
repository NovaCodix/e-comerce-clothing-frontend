import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // GUARDAMOS EL TOKEN JWT EN EL NAVEGADOR
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdminAuthenticated', 'true');
        toast.success("Bienvenido Administrador");
        navigate('/admin/create-product'); // Te lleva al panel
      } else {
        toast.error("Contraseña incorrecta");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border">
        <div className="flex justify-center mb-6">
          <div className="bg-black p-3 rounded-full text-white">
            <Lock className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Acceso Administrativo</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input 
              type="password" 
              placeholder="Contraseña Maestra" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center"
            />
          </div>
          <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar al Panel'}
          </Button>
        </form>
        
        <p className="text-xs text-center text-gray-400 mt-4">
          Área restringida. Si no eres admin, regresa al inicio.
        </p>
      </div>
    </div>
  );
}
