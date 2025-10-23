import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "./ProductCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MiniWishlistProps {
  favorites: Product[];
  onOpen: () => void;
}

export function MiniWishlist({ favorites, onOpen }: MiniWishlistProps) {
  if (favorites.length === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      onClick={onOpen}
      className="fixed bottom-24 right-6 z-40 bg-[#f4b8c4] text-white rounded-2xl shadow-lg p-3 hover:shadow-xl transition-shadow"
      aria-label="Ver favoritos"
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <Heart className="w-5 h-5 fill-current" />
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#f4b8c4] rounded-full flex items-center justify-center text-xs">
            {favorites.length}
          </span>
        </div>
        
        <div className="flex -space-x-2">
          {favorites.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-white"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
