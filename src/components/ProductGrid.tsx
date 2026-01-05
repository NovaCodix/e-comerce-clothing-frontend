import { ProductCard, Product } from "./ProductCard";
import { motion } from "motion/react";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  favoriteIds: (string | number)[];
  onToggleFavorite: (id: number | string) => void;
}

export function ProductGrid({ products, onAddToCart, onViewDetails, favoriteIds, onToggleFavorite }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">No se encontraron productos con estos filtros</p>
        <p>Intenta ajustar tus criterios de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
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
  );
}
