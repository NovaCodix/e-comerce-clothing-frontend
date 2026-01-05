import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "./ProductCard";
import { useState, useEffect, useMemo } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

// WhatsApp Icon SVG
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  // ACTUALIZADO: Acepta color y talla
  onAddToCart: (product: Product, size: string, color: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number | string) => void;
}

export function ProductDetailModal({ product, open, onClose, onAddToCart, isFavorite, onToggleFavorite }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);

  // Preselección inteligente al abrir
  useEffect(() => {
    if (open && product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]); // Seleccionar primer color
      }
      setSelectedSize(""); // Limpiar talla
      setSelectedImage(0);
    }
  }, [open, product]);

  if (!product) return null;

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice || !!product.originalPrice;

  // --- LÓGICA DE INVENTARIO ---
  // 1. Verificar stock de una talla para el color actual
  const checkStock = (sizeToCheck: string) => {
    if (!product.variants || product.variants.length === 0) return 99; // Fallback para productos viejos
    const variant = product.variants.find(v => v.size === sizeToCheck && v.color === selectedColor);
    return variant ? variant.stock : 0;
  };

  // 2. Stock de la selección actual
  const currentStock = selectedSize ? checkStock(selectedSize) : 0;
  // ----------------------------

  const productImages = [
    { src: product.image, label: "Vista frontal" },
    { src: product.image, label: "Vista lateral" },
    { src: product.image, label: "Vista posterior" },
    { src: product.image, label: "Detalle" },
  ];

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      onAddToCart(product, selectedSize, selectedColor);
      onClose();
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hola! Estoy interesado/a en el producto: ${product.name} - S/ ${displayPrice} (Talla: ${selectedSize}, Color: ${selectedColor})`
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background dark:bg-[#1a1a1a]">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">Detalle del producto</DialogDescription>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* GALERÍA */}
          <div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted mb-4">
              <ImageWithFallback
                src={productImages[selectedImage].src}
                alt={productImages[selectedImage].label}
                className={`w-full h-full object-cover transition-all ${currentStock === 0 && selectedSize ? "grayscale opacity-80" : ""}`}
              />
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <Badge className="bg-[#a8d5ba] hover:bg-[#a8d5ba]">✨ Nuevo</Badge>}
                {product.isTrending && <Badge className="bg-orange-500 hover:bg-orange-600 text-white">🔥 En Tendencia</Badge>}
                {product.isFeatured && <Badge className="!bg-purple-600 hover:!bg-purple-700 !text-white">⭐ Destacado</Badge>}
                {hasDiscount && <Badge className="bg-[#f4b8c4] hover:bg-[#f4b8c4]">🔥 Oferta</Badge>}
              </div>

              {selectedSize && currentStock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <span className="border-2 border-white text-white px-4 py-2 font-bold uppercase tracking-widest">
                        Agotado
                    </span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-primary" : "border-border hover:border-primary/50"
                  }`}
                >
                  <ImageWithFallback src={img.src} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* DETALLES */}
          <div className="flex flex-col">
            <p className="text-muted-foreground dark:text-[#CCCCCC] mb-2">{product.category}</p>
            <h2 className="mb-4 text-foreground dark:text-[#FFFFFF]">{product.name}</h2>
            
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-xl font-semibold ${hasDiscount ? "text-red-500" : "text-foreground dark:text-white"}`}>
                S/ {displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-muted-foreground dark:text-[#CCCCCC] line-through">
                  S/ {product.price.toFixed(2)}
                </span>
              )}
              {hasDiscount && (
                <Badge variant="outline" className="bg-[#f4b8c4]/10 text-[#f4b8c4] border-[#f4b8c4]">
                  Oferta
                </Badge>
              )}
            </div>

            {/* SELECCIÓN DE COLOR */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium dark:text-white">
                 1. Elige Color: <span className="capitalize text-muted-foreground ml-1">{selectedColor}</span>
              </h4>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => { setSelectedColor(color); setSelectedSize(""); }}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color 
                        ? "ring-2 ring-offset-2 ring-black dark:ring-white border-transparent scale-110" 
                        : "border-border hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* SELECCIÓN DE TALLA (Dinámica) */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                 <h4 className="text-sm font-medium dark:text-white">2. Elige Talla</h4>
                 {selectedSize && (
                    <span className={`text-xs font-bold ${currentStock > 0 ? "text-green-600" : "text-red-500"}`}>
                        {currentStock > 0 ? `${currentStock} disponibles` : "Sin Stock"}
                    </span>
                 )}
              </div>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => {
                  const stock = checkStock(size);
                  const isOutOfStock = stock === 0;

                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`min-w-[60px] py-3 px-4 rounded-lg border text-sm font-medium transition-all relative
                        ${selectedSize === size
                          ? "bg-black text-white border-black shadow-lg dark:bg-white dark:text-black"
                          : "bg-white text-gray-900 border-gray-200 hover:border-gray-400 dark:bg-[#252525] dark:text-white dark:border-gray-700"
                        }
                        ${isOutOfStock ? "opacity-40 cursor-not-allowed line-through bg-gray-100 dark:bg-gray-800" : ""}
                      `}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {!selectedColor && <p className="text-xs text-red-400 mt-2">Selecciona un color primero.</p>}
            </div>

            {/* BOTONES ACCIÓN */}
            <div className="flex flex-col gap-3 mt-auto">
              <Button
                size="lg"
                className="w-full rounded-full h-12 text-base"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || currentStock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {currentStock === 0 && selectedSize 
                    ? "AGOTADO EN ESTA OPCIÓN" 
                    : !selectedSize 
                        ? "SELECCIONA TALLA Y COLOR" 
                        : "AÑADIR AL CARRITO"
                }
              </Button>
              
              <TooltipProvider>
                <div className="grid grid-cols-2 gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="lg" className="rounded-full" onClick={() => onToggleFavorite?.(Number(product.id))}>
                        <Heart className={`w-5 h-5 ${isFavorite ? "fill-rose-400 text-rose-400" : ""}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{isFavorite ? "Quitar Favorito" : "Agregar Favorito"}</p></TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="lg" className="rounded-full text-green-600 border-green-200 hover:bg-green-50" asChild>
                        <a href={`https://wa.me/1234567890?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          <WhatsAppIcon className="w-5 h-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Consultar por WhatsApp</p></TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>

            {/* INFO ADICIONAL */}
            <Accordion type="single" collapsible className="mb-6 mt-6 border-t pt-4">
              <AccordionItem value="description">
                <AccordionTrigger>Descripción</AccordionTrigger>
                <AccordionContent><p className="text-muted-foreground whitespace-pre-line">{product.description || "N/A"}</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="materials">
                <AccordionTrigger>Materiales y Cuidado</AccordionTrigger>
                <AccordionContent><p className="text-muted-foreground whitespace-pre-line">{product.materialInfo || "N/A"}</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Envío y Devoluciones</AccordionTrigger>
                <AccordionContent><p className="text-muted-foreground whitespace-pre-line">{product.shippingInfo || "Envío gratis > S/. 200"}</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}