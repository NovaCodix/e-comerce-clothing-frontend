import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X, Heart, ShoppingCart, Sparkles, Leaf, Sun } from "lucide-react";
import { Product } from "./ProductCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface SpringCollectionProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (id: number) => void;
  favoriteIds: number[];
}

export function SpringCollection({
  open,
  onClose,
  products,
  onAddToCart,
  onToggleFavorite,
  favoriteIds,
}: SpringCollectionProps) {
  const springProducts = products.filter((p) => p.isNew || p.category === "Vestidos");

  const features = [
    {
      icon: Leaf,
      title: "Materiales Naturales",
      description: "Algodón orgánico y lino sostenible",
    },
    {
      icon: Sun,
      title: "Colores Vibrantes",
      description: "Paleta inspirada en la naturaleza primaveral",
    },
    {
      icon: Sparkles,
      title: "Diseños Frescos",
      description: "Cortes modernos y cómodos para el clima cálido",
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
          <DialogTitle>Colección Primavera 2024</DialogTitle>
          <DialogDescription>
            Descubre nuestra nueva colección de primavera con tendencias frescas y colores vibrantes
          </DialogDescription>
        </DialogHeader>
        {/* Hero Section */}
        <div className="relative h-80 overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
            alt="Colección Primavera 2024"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
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
              <Sparkles className="w-5 h-5" />
              <span>Nueva Temporada</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl mb-4"
            >
              Colección Primavera 2024
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 max-w-2xl"
            >
              Descubre los diseños más frescos y vibrantes inspirados en los colores de la naturaleza
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
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
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

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 mb-12"
          >
            <h3 className="mb-4 text-2xl">Sobre la Colección</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Nuestra Colección Primavera 2024 celebra el renacimiento de la naturaleza con piezas que combinan 
              elegancia y frescura. Cada prenda ha sido cuidadosamente diseñada con materiales sostenibles y 
              colores inspirados en jardines floridos y cielos despejados.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Desde vestidos fluidos hasta conjuntos versátiles, esta colección es perfecta para quienes buscan 
              estilo sin comprometer la comodidad. Ideal para cualquier ocasión, desde paseos casuales hasta 
              eventos especiales.
            </p>
          </motion.div>

          {/* Products */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-6 text-2xl"
            >
              Productos Destacados
            </motion.h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {springProducts.slice(0, 6).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
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

                      {product.isSale && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
                          Oferta
                        </div>
                      )}
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
