import { ShoppingCart, Heart, Menu, Moon, Sun, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { SearchBar } from "./SearchBar";
import { Product } from "./ProductCard";
import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// User menu and auth UI are temporarily disabled for guest-first flow
// import { UserMenu } from "./UserMenu";
// import { UserAccountModal } from "./UserAccountModal";
// import { useAuthContext } from "../contexts/AuthContext";
// import { useAdmin } from "../lib/supabase/hooks/useAdmin";

interface HeaderProps {
  onCartClick: () => void;
  onAuthClick: () => void;
  onFavoritesClick: () => void;
  onOrderTrackingClick: () => void;
  cartItemCount: number;
  favoriteCount: number;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

export function Header({ 
  onCartClick, 
  onAuthClick, 
  onFavoritesClick,
  onOrderTrackingClick,
  cartItemCount, 
  favoriteCount,
  darkMode,
  onDarkModeToggle,
  products,
  onSelectProduct,
  onCategorySelect,
  selectedCategory
}: HeaderProps) {
  const categories = ["Todos", "Mujer", "Hombre", "Niños", "Accesorios", "Ofertas"];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  // Auth context disabled for guest-first flow
  // const { user, signOut } = useAuthContext();
  // const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);

  // Auth-related modal handling disabled for now
  /*
  useEffect(() => {
    if (!user) {
      setShowAccountModal(false);
    }
  }, [user]);
  */

  // Keep the spacer height in sync with the actual header height (covers promo + nav rows)
  useEffect(() => {
    const updateSpacer = () => {
      const h = headerRef.current?.offsetHeight ?? 0;
      if (spacerRef.current) {
        spacerRef.current.style.height = h + "px";
      }
      // also expose as CSS var if other parts want to use it
      document.documentElement.style.setProperty("--header-offset", h + "px");
    };

    // Actualizar inmediatamente
    updateSpacer();
    
    // Actualizar después de un pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(updateSpacer, 100);
    
    window.addEventListener("resize", updateSpacer);
    return () => {
      window.removeEventListener("resize", updateSpacer);
      clearTimeout(timer);
    };
  }, [location.pathname]); // Re-calcular cuando cambia la ruta

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    setMobileMenuOpen(false);
    navigate('/coleccion');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleActionClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  const handleUserAccountClick = () => {
    setShowAccountModal(true);
  };

  const handleAuthModalClick = () => {
    onAuthClick();
  };

  return (
    <>
      <header
        className="bg-white dark:bg-[#1a1a1a] border-b border-border fixed left-0 right-0 z-50 transition-transform duration-300 shadow-sm"
        // keep header positioned at top and animate its visual position with transform (GPU-accelerated)
        style={{ top: 0, transform: 'translateY(var(--promo-height, 0px))' }}
        ref={headerRef}
      >
      {/* Top bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#b8a89a] rounded-lg flex items-center justify-center">
              <span className="text-white">✨</span>
            </div>
            <span className="tracking-wide">ESTILO</span>
          </button>

          {/* Search bar - Desktop */}
          <SearchBar 
            products={products}
            onSelectProduct={onSelectProduct}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          />

          {/* Icons */}
          <div className="flex items-center gap-2">
            {/* Order tracking temporarily removed for guest-first flow */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-accent"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#f4b8c4] hover:bg-[#f4b8c4]">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-accent hidden sm:flex"
              onClick={onFavoritesClick}
            >
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#f4b8c4] hover:bg-[#f4b8c4]">
                  {favoriteCount}
                </Badge>
              )}
            </Button>
            
            {/* User menu temporarily disabled (no login icon) */}
            
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent hidden sm:flex"
              onClick={onDarkModeToggle}
            >
              <motion.div
                initial={false}
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
            </Button>
            
            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden rounded-full hover:bg-gray-50 dark:hover:bg-accent transition-all duration-200"
                  aria-label="Abrir menú"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[320px] sm:w-[380px] p-0 flex flex-col bg-white dark:bg-[#1a1a1a] border-l-2 border-border/50 shadow-2xl"
              >
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0 bg-white dark:bg-[#1a1a1a]">
                  <SheetTitle className="text-left">Menú</SheetTitle>
                  <SheetDescription className="text-left">
                    Explora nuestras categorías
                  </SheetDescription>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-white dark:bg-[#1a1a1a]">
                  <div className="space-y-8">
                    {/* Categories */}
                    <div className="space-y-2">
                      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                        Categorías
                      </h3>
                      <div className="space-y-1">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                              selectedCategory === category
                                ? "bg-[#b8a89a] text-white shadow-sm"
                                : "hover:bg-accent/50"
                            }`}
                          >
                            <span>{category}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Acciones simplificadas: Favoritos y tema (sin auth ni seguimiento) */}
                    <div className="space-y-2">
                      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                        Acciones
                      </h3>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-12 rounded-xl border-border hover:bg-accent/50 relative" 
                          onClick={() => handleActionClick(onFavoritesClick)}
                        >
                          <Heart className="w-5 h-5 mr-3" />
                          <span>Favoritos</span>
                          {favoriteCount > 0 && (
                            <Badge className="ml-auto bg-[#f4b8c4] text-white hover:bg-[#f4b8c4] min-w-[24px] h-6">
                              {favoriteCount}
                            </Badge>
                          )}
                        </Button>

                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-12 rounded-xl border-border hover:bg-accent/50" 
                          onClick={() => {
                            onDarkModeToggle();
                            setMobileMenuOpen(false);
                          }}
                        >
                          {darkMode ? (
                            <>
                              <Sun className="w-5 h-5 mr-3" />
                              <span>Modo Claro</span>
                            </>
                          ) : (
                            <>
                              <Moon className="w-5 h-5 mr-3" />
                              <span>Modo Oscuro</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer del menú */}
                <div className="border-t border-border p-6 flex-shrink-0 bg-background/90 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#b8a89a] rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">✨</span>
                    </div>
                    <div>
                      <p className="text-sm">ESTILO</p>
                      <p className="text-xs text-muted-foreground">Moda contemporánea</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Categories - Desktop (hidden on Home '/') */}
      {location.pathname !== "/" && location.pathname !== "/seguimiento" && (
        <nav className="hidden md:block border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <ul className="flex items-center justify-center gap-8 py-3 flex-1">
                {categories.map((category) => (
                  <li key={category}>
                    <button 
                      onClick={() => handleCategoryClick(category)}
                      className={`hover:text-primary transition-colors relative ${
                        selectedCategory === category ? "text-primary" : ""
                      }`}
                    >
                      {category}
                      {selectedCategory === category && (
                        <motion.div
                          layoutId="category-underline"
                          className="absolute -bottom-3 left-0 right-0 h-0.5 bg-primary"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Trigger filter drawer open
                  const event = new CustomEvent('openFilters');
                  window.dispatchEvent(event);
                }}
                className="flex items-center gap-2 hover:bg-accent rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span className="font-medium">FILTRO</span>
              </Button>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-4">
        <SearchBar 
          products={products}
          onSelectProduct={onSelectProduct}
        />
      </div>
    </header>

    {/* Spacer to prevent content being hidden behind the fixed header.
      We set its height dynamically in JS to match the header's real height
      (covers promo + nav rows). Only show on collection page, not on home. */}
    {location.pathname !== "/" && (
      <div aria-hidden="true" className="header-spacer" ref={spacerRef} />
    )}
    
    {/* User account modal disabled for now */}
    </>
  );
}
