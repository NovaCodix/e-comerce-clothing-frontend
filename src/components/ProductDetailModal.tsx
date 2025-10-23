import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "./ProductCard";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

// WhatsApp Icon SVG
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

export function ProductDetailModal({ product, open, onClose, onAddToCart, isFavorite, onToggleFavorite }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  // Mock images for different angles
  const productImages = [
    { src: product.image, label: "Vista frontal" },
    { src: product.image, label: "Vista lateral" },
    { src: product.image, label: "Vista posterior" },
    { src: product.image, label: "Detalle" },
  ];

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart(product, selectedSize);
      onClose();
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hola! Estoy interesado/a en el producto: ${product.name} - S/ ${product.price}`
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background dark:bg-[#1a1a1a]">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">
          {product.name} - S/ {product.price} - {product.category}
        </DialogDescription>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted mb-4">
              <ImageWithFallback
                src={productImages[selectedImage].src}
                alt={productImages[selectedImage].label}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-[#a8d5ba] hover:bg-[#a8d5ba]">Nuevo</Badge>
                )}
                {product.isSale && (
                  <Badge className="bg-[#f4b8c4] hover:bg-[#f4b8c4]">Oferta</Badge>
                )}
              </div>
            </div>
            
            {/* Thumbnail gallery */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? "border-primary" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <ImageWithFallback
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-muted-foreground dark:text-[#CCCCCC] mb-2">{product.category}</p>
            <h2 className="mb-4 text-foreground dark:text-[#FFFFFF]">{product.name}</h2>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-foreground dark:text-[#FFFFFF]">S/ {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground dark:text-[#CCCCCC] line-through">
                  S/ {product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant="outline" className="bg-[#f4b8c4]/10 text-[#f4b8c4] border-[#f4b8c4]">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Product description with accordion */}
            <Accordion type="single" collapsible className="mb-6">
              <AccordionItem value="description">
                <AccordionTrigger>Descripción</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground dark:text-[#CCCCCC] text-justify">
                    Prenda de alta calidad confeccionada con materiales premium. Perfecta para cualquier ocasión, 
                    combina estilo y comodidad en un diseño único y versátil. Cada detalle ha sido cuidadosamente 
                    seleccionado para ofrecerte la mejor experiencia de uso.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="materials">
                <AccordionTrigger>Materiales y Cuidado</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground dark:text-[#CCCCCC] text-justify mb-2">
                    • 80% Algodón orgánico, 20% Poliéster reciclado<br />
                    • Lavar a máquina en agua fría<br />
                    • No usar blanqueador<br />
                    • Secar a baja temperatura
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="shipping">
                <AccordionTrigger>Envío y Devoluciones</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground dark:text-[#CCCCCC] text-justify">
                    Envío gratis en compras mayores a $50. Entregas en 3-5 días hábiles. 
                    Devoluciones gratuitas dentro de los 30 días posteriores a la compra.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Size selector */}
            <div className="mb-6">
              <h4 className="mb-4 text-center text-foreground dark:text-[#FFFFFF]">Selecciona tu talla</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[60px] py-3 px-4 rounded-lg border transition-all text-center ${
                      selectedSize === size
                        ? "bg-[#b8a89a] text-white border-[#b8a89a] shadow-lg shadow-[#b8a89a]/30"
                        : "border-border hover:border-[#b8a89a] bg-background dark:bg-[#252525] text-foreground dark:text-[#FFFFFF] hover:bg-[#b8a89a]/10"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color selector */}
            <div className="mb-6">
              <h4 className="mb-3 text-center text-foreground dark:text-[#FFFFFF]">Colores disponibles</h4>
              <div className="flex justify-center gap-3">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full border-2 border-border hover:scale-110 hover:ring-2 hover:ring-[#b8a89a] hover:ring-offset-2 dark:ring-offset-[#1a1a1a] transition-all cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-auto">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {selectedSize ? "Añadir al Carrito" : "Selecciona una talla"}
              </Button>
              
              <TooltipProvider>
                <div className="grid grid-cols-2 gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className={`rounded-full ${isFavorite ? "bg-[#f4b8c4]/10 border-[#f4b8c4] text-[#f4b8c4]" : ""}`}
                        onClick={() => onToggleFavorite?.(product.id)}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite ? "fill-[#f4b8c4]" : ""}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full bg-[#25D366]/10 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/20"
                        asChild
                      >
                        <a
                          href={`https://wa.me/1234567890?text=${whatsappMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          <WhatsAppIcon className="w-5 h-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Consultar por WhatsApp</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>

            {/* Additional info */}
            <div className="mt-6 pt-6 border-t border-border space-y-3 text-muted-foreground dark:text-[#CCCCCC]">
              <p>✓ Envío gratis en compras mayores a $50</p>
              <p>✓ Devoluciones gratuitas en 30 días</p>
              <p>✓ Pago seguro garantizado</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
