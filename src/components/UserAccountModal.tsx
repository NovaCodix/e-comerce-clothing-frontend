import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Mail, User, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Alert, AlertDescription } from "./ui/alert";

interface UserAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function UserAccountModal({ open, onClose }: UserAccountModalProps) {
  const { user, updatePassword } = useAuthContext();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validaciones
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await updatePassword(newPassword);

      if (updateError) {
        setError(updateError.message || "Error al cambiar la contraseña");
        return;
      }

      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      
      setTimeout(() => {
        setShowChangePassword(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Error inesperado al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowChangePassword(false);
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  // Obtener el nombre completo del usuario desde metadata
  const fullName = user?.user_metadata?.full_name || "Usuario";
  const email = user?.email || "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-background border-2 border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground">
            Mi Cuenta
          </DialogTitle>
          <DialogDescription className="sr-only">
            Gestiona tu información personal y cambia tu contraseña
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar y nombre */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#b8a89a]/10 to-[#9d8b7d]/5 border border-[#b8a89a]/20">
            <Avatar className="h-16 w-16 ring-4 ring-[#b8a89a]/30">
              <AvatarFallback className="bg-gradient-to-br from-[#b8a89a] to-[#9d8b7d] text-white text-xl font-bold">
                {fullName
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{fullName}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre completo
              </Label>
              <div className="mt-2">
                <Input 
                  value={fullName} 
                  disabled 
                  className="bg-muted/30 cursor-not-allowed border-border text-foreground"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Correo electrónico
              </Label>
              <div className="mt-2">
                <Input 
                  value={email} 
                  disabled 
                  className="bg-muted/30 cursor-not-allowed border-border text-foreground"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Cambiar contraseña */}
          <div>
            {!showChangePassword ? (
              <Button
                variant="outline"
                className="w-full border-2 border-border hover:bg-accent/50 hover:border-[#b8a89a]/50 transition-all"
                onClick={() => setShowChangePassword(true)}
              >
                <Lock className="w-4 h-4 mr-2" />
                Cambiar contraseña
              </Button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Cambiar contraseña</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="hover:bg-accent/50"
                    onClick={() => {
                      setShowChangePassword(false);
                      setNewPassword("");
                      setConfirmPassword("");
                      setError(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 border-2 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
                      ¡Contraseña cambiada exitosamente!
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="new-password" className="text-sm font-medium text-foreground">
                    Nueva contraseña
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 border-2 border-border focus:border-[#b8a89a] bg-background text-foreground"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                    Confirmar contraseña
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 border-2 border-border focus:border-[#b8a89a] bg-background text-foreground"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#b8a89a] hover:bg-[#9d8b7d] text-white font-medium"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
                </Button>
              </form>
            )}
          </div>

          {/* Información adicional */}
          <div className="text-sm text-muted-foreground space-y-2 pt-2 px-3 py-3 rounded-lg bg-muted/20 border border-border/50">
            <p className="flex items-start gap-2">
              <span className="text-[#b8a89a] mt-0.5">•</span>
              <span>Tu información personal está protegida</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#b8a89a] mt-0.5">•</span>
              <span>Puedes cambiar tu contraseña en cualquier momento</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#b8a89a] mt-0.5">•</span>
              <span>Para cambiar tu email, contacta a soporte</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
