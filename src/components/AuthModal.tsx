import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../lib/supabase/hooks/useAuth";
import { Alert, AlertDescription } from "./ui/alert";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle, loading, error } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sideImageLoaded, setSideImageLoaded] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Formularios
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        setLocalError(error.message === 'Invalid login credentials' 
          ? 'Credenciales incorrectas' 
          : error.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1000);
    } catch (err) {
      setLocalError("Error al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validaciones
    if (registerForm.password !== registerForm.confirmPassword) {
      setLocalError("Las contraseñas no coinciden");
      return;
    }

    if (registerForm.password.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const { error } = await signUp(
        registerForm.email,
        registerForm.password,
        registerForm.fullName
      );

      if (error) {
        setLocalError(error.message === 'User already registered' 
          ? 'Este correo ya está registrado' 
          : error.message);
        return;
      }

      setSuccess(true);
      setLocalError(null);
      
      // Mostrar mensaje de verificación de email
      alert("¡Cuenta creada! Por favor verifica tu correo electrónico.");
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setLocalError("Error al crear la cuenta. Inténtalo de nuevo.");
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError("Error al iniciar sesión con Google");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl overflow-hidden shadow-2xl text-gray-900">
          {/* Left - form */}
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.svg"
                alt="ESTILO"
                className="w-10 h-10 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <h3 className="text-lg font-semibold text-gray-900">ESTILO</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Inicia sesión o crea una cuenta para continuar</p>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'login' ? 'bg-gray-100 text-gray-900 border border-gray-200' : 'bg-white text-gray-600 border border-gray-200'}`}
                aria-pressed={mode === 'login'}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'register' ? 'bg-gray-100 text-gray-900 border border-gray-200' : 'bg-white text-gray-600 border border-gray-200'}`}
                aria-pressed={mode === 'register'}
              >
                Registrarse
              </button>
            </div>

            {/* Mensajes de error y éxito */}
            {(localError || error) && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{localError || error?.message}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  {mode === 'login' ? '¡Inicio de sesión exitoso!' : '¡Cuenta creada exitosamente!'}
                </AlertDescription>
              </Alert>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-sm text-gray-600">Correo electrónico</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="tucorreo@ejemplo.com" 
                      className="pl-10 h-11 rounded-md bg-white border-gray-200" 
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-sm text-gray-600">Contraseña</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="login-password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className="pl-10 pr-10 h-11 rounded-md bg-white border-gray-200"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button type="button" className="text-sm text-gray-500">¿Olvidaste tu contraseña?</button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Iniciando...' : 'Iniciar sesión'}
                </Button>

                <div className="relative my-4">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-500">o continúa con</span>
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    Google
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name" className="text-sm text-gray-600">Nombre completo</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="register-name" 
                      type="text" 
                      placeholder="Tu nombre" 
                      className="pl-10 h-11 rounded-md bg-white border-gray-200"
                      value={registerForm.fullName}
                      onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email" className="text-sm text-gray-600">Correo electrónico</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="tucorreo@ejemplo.com" 
                      className="pl-10 h-11 rounded-md bg-white border-gray-200"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-password" className="text-sm text-gray-600">Contraseña</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="register-password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className="pl-10 pr-10 h-11 rounded-md bg-white border-gray-200"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-confirm-password" className="text-sm text-gray-600">Confirmar contraseña</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="register-confirm-password" 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className="pl-10 pr-10 h-11 rounded-md bg-white border-gray-200"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required 
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear cuenta'}
                </Button>

                <p className="text-xs text-gray-500 mt-2">Al registrarte aceptas nuestros <button type="button" className="text-blue-600 underline">Términos y Condiciones</button></p>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">{mode === 'login' ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"} <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-gray-900 font-semibold underline">{mode === 'login' ? 'Inicia sesión' : 'Inicia sesión'}</button></p>
            </div>
          </div>

          {/* Right - visual with image/fallback */}
          <div className="hidden md:flex items-center justify-center relative bg-gray-50">
            {sideImageLoaded ? (
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                alt="Visual estilo"
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => setSideImageLoaded(false)}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100" />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
