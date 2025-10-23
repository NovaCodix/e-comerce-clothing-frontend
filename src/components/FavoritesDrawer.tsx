import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Product } from "./ProductCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";

interface FavoritesDrawerProps {
  open: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (id: number) => void;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function FavoritesDrawer({ 
  open, 
  onClose, 
  favorites, 
  onRemoveFavorite,
  onViewDetails,
  onAddToCart
}: FavoritesDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-current text-[#f4b8c4]" />
            Mis Favoritos ({favorites.length})
          </SheetTitle>
          <SheetDescription className="sr-only">
            Lista de productos que has marcado como favoritos
          </SheetDescription>
        </SheetHeader>

        {favorites.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No tienes favoritos aún</p>
            <p className="text-muted-foreground mb-6">¡Agrega productos que te gusten!</p>
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90 rounded-full">
              Explorar productos
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-6 space-y-4">
            {favorites.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div 
                    className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 cursor-pointer"
                    onClick={() => onViewDetails(product)}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="line-clamp-1 mb-1 cursor-pointer hover:text-primary" onClick={() => onViewDetails(product)}>
                          {product.name}
                        </h4>
                        <p className="text-muted-foreground">{product.category}</p>
                      </div>
                      <button
                        onClick={() => onRemoveFavorite(product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Eliminar de favoritos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="">S/ {product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-muted-foreground line-through">
                          S/ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90 rounded-full"
                      onClick={() => {
                        onAddToCart(product);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar al Carrito
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
