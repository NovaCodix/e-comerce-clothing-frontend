import { User, LogOut, UserCircle, Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuthContext } from "../contexts/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../lib/supabase/hooks/useAdmin";

interface UserMenuProps {
  onAccountClick: () => void;
  onSignInClick: () => void;
}

export function UserMenu({ onAccountClick, onSignInClick }: UserMenuProps) {
  const { user, signOut, loading } = useAuthContext();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Si no hay usuario autenticado
  if (!user) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-accent"
        onClick={onSignInClick}
        title="Iniciar sesión"
      >
        <User className="w-5 h-5" />
      </Button>
    );
  }

  // Usuario autenticado - mostrar menú
  const fullName = user.user_metadata?.full_name || "Usuario";
  const email = user.email || "";
  
  // Obtener iniciales para el avatar
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full hover:bg-accent h-9 w-9 p-0 focus-visible:ring-2 focus-visible:ring-[#b8a89a]"
          title="Mi cuenta"
        >
          <Avatar className="h-8 w-8 ring-2 ring-[#b8a89a]/20">
            <AvatarFallback className="bg-gradient-to-br from-[#b8a89a] to-[#9d8b7d] text-white text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-background/95 backdrop-blur-lg border-2 border-border shadow-xl p-2"
      >
        <DropdownMenuLabel className="pb-2 px-2">
          <div className="flex items-start gap-3 py-2">
            <Avatar className="h-10 w-10 ring-2 ring-[#b8a89a]/30 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-[#b8a89a] to-[#9d8b7d] text-white text-base font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuItem
          onClick={onAccountClick}
          className="cursor-pointer rounded-md mx-1 px-2 py-2.5 focus:bg-accent/50 dark:focus:bg-accent/50"
        >
          <UserCircle className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium">Ver cuenta</span>
        </DropdownMenuItem>
        
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => navigate('/admin')}
            className="cursor-pointer rounded-md mx-1 px-2 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 focus:from-purple-100 focus:to-pink-100 dark:focus:from-purple-900/30 dark:focus:to-pink-900/30"
          >
            <Settings className="mr-3 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Administrador</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="my-2" />
        
        <div className="h-1"></div>
        
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="cursor-pointer rounded-md mx-1 px-2 py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-950/30"
        >
          <LogOut className="mr-3 h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">
            {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
