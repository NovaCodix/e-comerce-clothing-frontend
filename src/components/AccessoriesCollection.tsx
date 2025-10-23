import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X, Heart, ShoppingCart, Award, Package, Shield } from "lucide-react";
import { Product } from "./ProductCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface AccessoriesCollectionProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (id: number) => void;
  favoriteIds: number[];
}

export function AccessoriesCollection({
  open,
  onClose,
  products,
  onAddToCart,
  onToggleFavorite,
  favoriteIds,
}: AccessoriesCollectionProps) {
  const accessoriesProducts = products.filter((p) => p.category === "Accesorios");

  const features = [
    {
      icon: Award,
      title: "Calidad Premium",
      description: "Materiales de la más alta calidad",
    },
    {
      icon: Shield,
      title: "Garantía Extendida",
      description: "12 meses de garantía en todos los accesorios",
    },
    {
      icon: Package,
      title: "Empaque Exclusivo",
      description: "Presentación elegante perfecta para regalo",
    },
  ];

  const categories = [
    {
      name: "Bolsos & Carteras",
      description: "Diseños elegantes para cada ocasión",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
    },
    {
      name: "Joyería",
      description: "Piezas únicas que resaltan tu estilo",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    },
    {
      name: "Calzado",
      description: "Comodidad y estilo en cada paso",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    },
    {
      name: "Cinturones & Más",
      description: "Detalles que completan tu outfit",
      image: "https://images.unsplash.com/photo-1624222247344-550fb60583b8?w=600&q=80",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] lg:max-w-7xl max-h-[90vh] overflow-y-auto p-0 bg-background"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          transform: 'translate3d(0,0,0)',
          willChange: 'transform',
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Colección de Accesorios Premium</DialogTitle>
          <DialogDescription>
            Explora nuestra selección exclusiva de accesorios de lujo para complementar tu estilo
          </DialogDescription>
        </DialogHeader>
        {/* Hero Section */}
        <div className="relative h-80 overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
            alt="Accesorios Premium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-purple-900/30 to-transparent" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-4"
            >
              <Award className="w-5 h-5" />
              <span>Edición Limitada</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl mb-4"
            >
              Accesorios Premium
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 max-w-2xl"
            >
              Complementa tu estilo con nuestra colección exclusiva de accesorios de lujo
            </motion.p>
          </motion.div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <h4 className="mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Categories Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <h3 className="mb-6 text-2xl">Explora Nuestras Categorías</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-lg">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <h4 className="text-sm mb-1">{category.name}</h4>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 mb-12"
          >
            <h3 className="mb-4 text-2xl">Accesorios que Transforman</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Cada accesorio de nuestra colección premium ha sido seleccionado por su excepcional calidad, 
              diseño único y versatilidad. Desde bolsos de cuero italiano hasta joyería artesanal, cada 
              pieza cuenta una historia de elegancia y sofisticación.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Perfectos para complementar cualquier outfit o como el regalo ideal, nuestros accesorios 
              premium transforman lo ordinario en extraordinario. Descubre piezas que no solo completan 
              tu look, sino que lo definen.
            </p>
          </motion.div>

          {/* Products */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="mb-6 text-2xl"
            >
              Productos Premium
            </motion.h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessoriesProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      <button
                        onClick={() => onToggleFavorite(product.id)}
                        className="absolute top-3 right-3 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favoriteIds.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-foreground"
                          }`}
                        />
                      </button>

                      <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
                        Premium
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="mb-2 line-clamp-1">{product.name}</h4>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-primary">S/ {product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            S/ {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <Button
                        onClick={() => onAddToCart(product)}
                        className="w-full rounded-full group/btn"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Agregar al Carrito
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
