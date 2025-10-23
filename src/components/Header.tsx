import { ShoppingCart, Heart, User, Menu, Moon, Sun, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { SearchBar } from "./SearchBar";
import { Product } from "./ProductCard";
import { motion } from "motion/react";
import { useState } from "react";

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

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    setMobileMenuOpen(false);
  };

  const handleActionClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className="bg-background/95 backdrop-blur-lg border-b border-border fixed left-0 right-0 z-50 transition-transform duration-300"
        // keep header positioned at top and animate its visual position with transform (GPU-accelerated)
        style={{ top: 0, transform: 'translateY(var(--promo-height, 0px))' }}
      >
      {/* Top bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#b8a89a] rounded-lg flex items-center justify-center">
              <span className="text-white">✨</span>
            </div>
            <span className="tracking-wide">ESTILO</span>
          </div>

          {/* Search bar - Desktop */}
          <SearchBar 
            products={products}
            onSelectProduct={onSelectProduct}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          />

          {/* Icons */}
          <div className="flex items-center gap-2">
            {/* Order Tracking */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-accent hidden sm:flex"
              onClick={onOrderTrackingClick}
              title="Seguimiento de pedidos"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Package className="w-5 h-5" />
              </motion.div>
            </Button>
            
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
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent hidden sm:flex"
              onClick={onAuthClick}
            >
              <User className="w-5 h-5" />
            </Button>
            
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
                  className="md:hidden rounded-full hover:bg-[#f5f0ed] dark:hover:bg-accent transition-all duration-200"
                  aria-label="Abrir menú"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[320px] sm:w-[380px] p-0 flex flex-col bg-background/95 backdrop-blur-xl border-l-2 border-border/50 shadow-2xl"
              >
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0 bg-background/80">
                  <SheetTitle className="text-left">Menú</SheetTitle>
                  <SheetDescription className="text-left">
                    Explora nuestras categorías
                  </SheetDescription>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-background/95">
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

                    {/* User Actions */}
                    <div className="space-y-2">
                      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                        Mi cuenta
                      </h3>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-12 rounded-xl border-border hover:bg-accent/50" 
                          onClick={() => handleActionClick(onAuthClick)}
                        >
                          <User className="w-5 h-5 mr-3" />
                          <span>Mi Cuenta</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-12 rounded-xl border-border hover:bg-accent/50" 
                          onClick={() => handleActionClick(onOrderTrackingClick)}
                        >
                          <Package className="w-5 h-5 mr-3" />
                          <span>Mis Pedidos</span>
                        </Button>
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

      {/* Categories - Desktop */}
      <nav className="hidden md:block border-t border-border">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-3">
            {categories.map((category) => (
              <li key={category}>
                <button 
                  onClick={() => onCategorySelect(category)}
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
        </div>
      </nav>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-4">
        <SearchBar 
          products={products}
          onSelectProduct={onSelectProduct}
        />
      </div>
    </header>

        {/* Spacer to prevent content being hidden behind the fixed header.
            The spacer's height is header base + promo height (defined in CSS) so
            when the header is translated down visually the document flow still
            reserves the correct space and prevents layout jumps. */}
        <div aria-hidden="true" className="header-spacer" />
    </>
  );
}
