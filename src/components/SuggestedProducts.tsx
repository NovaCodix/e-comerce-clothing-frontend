import { Product, ProductCard } from "./ProductCard";
import { motion } from "motion/react";

interface SuggestedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  favoriteIds: (string | number)[];
  onToggleFavorite: (id: number | string) => void;
}

export function SuggestedProducts({ 
  products, 
  onAddToCart, 
  onViewDetails,
  favoriteIds,
  onToggleFavorite
}: SuggestedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">Quizás Te Guste Esto</h2>
          <p className="text-muted-foreground">Productos seleccionados especialmente para ti</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
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
