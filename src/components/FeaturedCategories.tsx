import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

interface Category {
  name: string;
  image: string;
  itemCount: number;
}

interface FeaturedCategoriesProps {
  onCategoryClick: (category: string) => void;
}

export function FeaturedCategories({ onCategoryClick }: FeaturedCategoriesProps) {
  const navigate = useNavigate();
  
  const categories: Category[] = [
    {
      name: "Mujer",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
      itemCount: 150,
    },
    {
      name: "Hombre",
      image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80",
      itemCount: 120,
    },
    {
      name: "Accesorios",
      image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80",
      itemCount: 85,
    },
    {
      name: "Niños",
      image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80",
      itemCount: 95,
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">Explora por Categoría</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra amplia selección de productos organizados especialmente para ti
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.42, 0, 0.58, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => {
                onCategoryClick(category.name);
                navigate('/coleccion');
              }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
              style={{ willChange: "transform, opacity" }}
            >
              <ImageWithFallback
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="mb-2"
                >
                  {category.name}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-white/80 text-sm"
                >
                  {category.itemCount}+ productos
                </motion.p>
              </div>

              {/* Hover effect line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
