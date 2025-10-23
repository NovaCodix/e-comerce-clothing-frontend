import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  isSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails, isFavorite, onToggleFavorite }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-background dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border border-border hover:shadow-2xl hover:border-primary/30 transition-all duration-300"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f0ed] cursor-pointer" onClick={() => onViewDetails(product)}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full"
        >
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Badge className="bg-[#a8d5ba] hover:bg-[#a8d5ba] shadow-lg">
                ✨ Nuevo
              </Badge>
            </motion.div>
          )}
          {product.isSale && (
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <Badge className="bg-[#f4b8c4] hover:bg-[#f4b8c4] shadow-lg">
                🔥 Oferta
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Favorite button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(product.id);
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

        {/* Quick add overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            className="w-full bg-white text-[#2a2a2a] hover:bg-white/90 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Agregar al Carrito
          </Button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-muted-foreground dark:text-[#CCCCCC] mb-1">{product.category}</p>
        <h4 className="mb-2 line-clamp-1 text-foreground dark:text-[#FFFFFF]">{product.name}</h4>
        <div className="flex items-center gap-2">
          <span className="text-foreground dark:text-[#FFFFFF]">S/ {product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-muted-foreground dark:text-[#CCCCCC] line-through">
              S/ {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Colors preview */}
        <div className="flex gap-1 mt-3">
          {product.colors.slice(0, 4).map((color, index) => (
            <div
              key={index}
              className="w-5 h-5 rounded-full border border-border"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
