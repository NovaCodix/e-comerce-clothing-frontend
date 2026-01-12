import { motion } from "motion/react";
import { ProductCard, Product } from "./ProductCard";
import { TrendingUp, Flame } from "lucide-react";

interface TrendingProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  favoriteIds: (string | number)[];
  onToggleFavorite: (id: number | string) => void;
}

export function TrendingProducts({
  products,
  onAddToCart,
  onViewDetails,
  favoriteIds,
  onToggleFavorite,
}: TrendingProductsProps) {
  // Filtrar SOLO productos marcados como "en tendencia" (isTrending = true) y activos
  const displayProducts = products
    .filter((p) => p.isTrending && p.isActive)
    .slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Flame className="w-8 h-8 text-orange-500" />
          </motion.div>
          <div className="text-center">
            <h2 className="mb-2">Productos en Tendencia</h2>
            <p className="text-muted-foreground flex items-center gap-2 justify-center">
              <TrendingUp className="w-4 h-4" />
              Lo más popular esta semana
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.42, 0, 0.58, 1],
              }}
              style={{ willChange: "transform, opacity" }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
                isFavorite={favoriteIds.some(favId => String(favId) === String(product.id))}
                onToggleFavorite={onToggleFavorite}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
