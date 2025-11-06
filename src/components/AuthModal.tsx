import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("¡Inicio de sesión exitoso!");
      onClose();
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("¡Cuenta creada exitosamente!");
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
          {/* Left - form */}
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              {/* store logo - replace /logo.svg with actual path */}
              <img src="/logo.svg" alt="ESTILO" className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ESTILO</h3>
            </div>

            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Start your journey</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Sign up or log in to access your account</p>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm ${mode === 'login' ? 'bg-white dark:bg-slate-800 shadow' : 'bg-gray-100 dark:bg-slate-700/40 text-gray-700 dark:text-gray-200'}`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2 rounded-lg text-sm ${mode === 'register' ? 'bg-white dark:bg-slate-800 shadow' : 'bg-gray-100 dark:bg-slate-700/40 text-gray-700 dark:text-gray-200'}`}
              >
                Registrarse
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-sm text-gray-600">E-mail</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input id="login-email" type="email" placeholder="example@email.com" className="pl-10 h-11 rounded-lg border border-gray-200 bg-white" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-sm text-gray-600">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input id="login-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10 h-11 rounded-lg border border-gray-200 bg-white" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button type="button" className="text-sm text-[#6b7280]">¿Olvidaste tu contraseña?</button>
                </div>

                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{isLoading ? 'Iniciando...' : 'Sign In'}</Button>

                <div className="relative my-4">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-3 text-xs text-gray-500">o continúa con</span>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">Facebook</Button>
                  <Button variant="outline" className="flex-1">Google</Button>
                  <Button variant="outline" className="flex-1">Apple</Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name" className="text-sm text-gray-600">Nombre completo</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input id="register-name" type="text" placeholder="Tu nombre" className="pl-10 h-11 rounded-lg border border-gray-200 bg-white" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email" className="text-sm text-gray-600">E-mail</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input id="register-email" type="email" placeholder="example@email.com" className="pl-10 h-11 rounded-lg border border-gray-200 bg-white" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-password" className="text-sm text-gray-600">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input id="register-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10 h-11 rounded-lg border border-gray-200 bg-white" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-confirm-password" className="text-sm text-gray-600">Confirmar Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input id="register-confirm-password" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10 h-11 rounded-lg border border-gray-200 bg-white" required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{isLoading ? 'Creando...' : 'Crear cuenta'}</Button>

                <p className="text-xs text-gray-500 mt-2">Al registrarte aceptas nuestros <button type="button" className="text-blue-600 underline">Términos y Condiciones</button></p>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">{mode === 'login' ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"} <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-blue-600 font-semibold">{mode === 'login' ? 'Regístrate' : 'Inicia sesión'}</button></p>
            </div>
          </div>

          {/* Right - visual */}
          <div className="hidden md:flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/auth-side.jpg')" }}>
            <div className="bg-black/30 p-6 rounded-lg text-center text-white max-w-sm">
              <h3 className="text-2xl font-bold">Bienvenido a ESTILO</h3>
              <p className="mt-2 text-sm">Descubre las últimas tendencias en moda y estilo. Tu viaje comienza aquí.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
