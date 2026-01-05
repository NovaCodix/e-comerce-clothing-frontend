import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Definimos la estructura de la variante
export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number; // Agregado para soportar la oferta nueva
  image: string;
  category: string;
  gender?: string;
  // Listas resumen (para filtros visuales)
  sizes: string[];
  colors: string[];
  
  // INVENTARIO REAL (SKU)
  variants?: ProductVariant[];
  
  isNew?: boolean;
  isSale?: boolean;
  isTrending?: boolean;  // ← AGREGADO: Indica si está en tendencia
  isFeatured?: boolean;  // ← AGREGADO: Indica si está destacado
  isActive?: boolean;
  
  // Info extra (Opcionales para evitar errores si faltan en BD)
  materialInfo?: string;
  shippingInfo?: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number | string) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails, isFavorite, onToggleFavorite }: ProductCardProps) {
  
  // 1. CALCULAR STOCK TOTAL
  // Sumamos el stock de todas las variantes. Si no hay variantes (ej: datos antiguos), asumimos que hay stock (99)
  const totalStock = product.variants 
    ? product.variants.reduce((acc, v) => acc + v.stock, 0) 
    : 99;
    
  const isOutOfStock = totalStock === 0;

  // Usamos el precio de oferta si existe, si no el base
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice || !!product.originalPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-background dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border border-border hover:shadow-2xl hover:border-primary/30 transition-all duration-300"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f0ed] cursor-pointer" onClick={() => onViewDetails(product)}>
        
        {/* IMAGEN (Se pone gris si no hay stock) */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`w-full h-full ${isOutOfStock ? "grayscale opacity-70" : ""}`}
        >
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* --- OVERLAY AGOTADO --- */}
        {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 pointer-events-none">
                <span className="border-2 border-white text-white px-4 py-2 font-bold uppercase tracking-widest text-lg transform -rotate-12">
                    Agotado
                </span>
            </div>
        )}

        {/* Badges (Solo si hay stock) */}
        {!isOutOfStock && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
                <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
                >
                <Badge className="bg-[#a8d5ba] hover:bg-[#a8d5ba] shadow-lg">✨ Nuevo</Badge>
                </motion.div>
            )}
            {product.isTrending && (
                <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.25 }}
                >
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg">🔥 En Tendencia</Badge>
                </motion.div>
            )}
            {product.isFeatured && (
                <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.27 }}
                >
                <Badge className="!bg-purple-600 hover:!bg-purple-700 !text-white shadow-lg">⭐ Destacado</Badge>
                </motion.div>
            )}
            {hasDiscount && (
                <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.3 }}
                >
                <Badge className="bg-[#f4b8c4] hover:bg-[#f4b8c4] shadow-lg">🔥 Oferta</Badge>
                </motion.div>
            )}
            </div>
        )}

        {/* Favorite button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) {
              onToggleFavorite(product.id);
            }
          }}
          className={`absolute top-3 right-3 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all ${
            isFavorite 
              ? "bg-[#f4b8c4] opacity-100" 
              : "bg-white/90 opacity-0 group-hover:opacity-100 hover:bg-white"
          }`}
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart className={`w-5 h-5 transition-all ${isFavorite ? "fill-white text-white" : ""}`} />
        </motion.button>

        {/* Quick actions overlay (SOLO SI HAY STOCK) */}
        {!isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                className="w-full bg-white text-[#2a2a2a] hover:bg-white/90 rounded-full font-semibold"
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Agregar al Carrito
              </Button>
            </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-muted-foreground dark:text-[#CCCCCC] mb-1">{product.category}</p>
        <h4 className="mb-2 line-clamp-1 text-foreground dark:text-[#FFFFFF]">{product.name}</h4>
        
        <div className="flex items-center gap-2">
          {/* Precio Actual */}
          <span className={`text-foreground dark:text-[#FFFFFF] ${hasDiscount ? "text-red-500 font-bold" : ""}`}>
            S/ {displayPrice.toFixed(2)}
          </span>
          
          {/* Precio Original Tachado (Si hay descuento) */}
          {hasDiscount && (
            <span className="text-muted-foreground dark:text-[#CCCCCC] line-through text-sm">
              S/ {product.price.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Colors preview */}
        <div className="flex gap-1 mt-3">
          {product.colors.slice(0, 4).map((color, index) => (
            <div
              key={index}
              className="w-5 h-5 rounded-full border border-border shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          {product.colors.length > 4 && (
             <span className="text-xs text-muted-foreground ml-1">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}