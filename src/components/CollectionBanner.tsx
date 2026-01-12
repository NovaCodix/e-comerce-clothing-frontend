import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CollectionBannerProps {
  onSpringClick?: () => void;
  onAccessoriesClick?: () => void;
}

export function CollectionBanner({ onSpringClick, onAccessoriesClick }: CollectionBannerProps) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Collection 1 */}
          <div className="group relative h-[280px] sm:h-[350px] md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out">
            <div 
              className="absolute inset-0"
              style={{ pointerEvents: 'none' }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
                alt="Colección Primavera"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
            </div>
            
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
              style={{ pointerEvents: 'none' }}
            />
            
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
              <div className="relative">
                <span 
                  className="inline-block px-3 md:px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs md:text-sm mb-3 md:mb-4"
                  style={{ pointerEvents: 'none' }}
                >
                  Nueva Temporada
                </span>
                <h3 
                  className="text-white text-2xl md:text-3xl mb-2 md:mb-3"
                  style={{ pointerEvents: 'none' }}
                >
                  Colección Primavera 2024
                </h3>
                <p 
                  className="text-white/80 text-sm md:text-base mb-4 md:mb-6 line-clamp-2"
                  style={{ pointerEvents: 'none' }}
                >
                  Descubre los diseños más frescos y vibrantes de la temporada
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Spring Collection clicked - Direct button handler');
                    onSpringClick?.();
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Spring Collection pointer up - Direct button handler');
                    onSpringClick?.();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Spring Collection touch - Direct button handler');
                    onSpringClick?.();
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#2a2a2a] hover:bg-white/90 rounded-full shadow-lg px-4 py-2 text-sm md:text-base transition-all active:scale-95 cursor-pointer"
                  style={{
                    pointerEvents: 'auto',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'rgba(255,255,255,0.2)',
                    position: 'relative',
                    zIndex: 10, /* ensure overlay (z-90) and modal content (z-100) sit above */
                    border: 'none',
                    outline: 'none',
                  }}
                  type="button"
                >
                  Ver Colección
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Collection 2 */}
          <div className="group relative h-[280px] sm:h-[350px] md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out">
            <div 
              className="absolute inset-0"
              style={{ pointerEvents: 'none' }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="Accesorios Exclusivos"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
            </div>
            
            <div 
              className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-purple-900/30 to-transparent"
              style={{ pointerEvents: 'none' }}
            />
            
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
              <div className="relative">
                <span 
                  className="inline-block px-3 md:px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs md:text-sm mb-3 md:mb-4"
                  style={{ pointerEvents: 'none' }}
                >
                  Edición Limitada
                </span>
                <h3 
                  className="text-white text-2xl md:text-3xl mb-2 md:mb-3"
                  style={{ pointerEvents: 'none' }}
                >
                  Accesorios Premium
                </h3>
                <p 
                  className="text-white/80 text-sm md:text-base mb-4 md:mb-6 line-clamp-2"
                  style={{ pointerEvents: 'none' }}
                >
                  Complementa tu estilo con nuestros accesorios exclusivos
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Accessories Collection clicked - Direct button handler');
                    onAccessoriesClick?.();
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Accessories Collection pointer up - Direct button handler');
                    onAccessoriesClick?.();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Accessories Collection touch - Direct button handler');
                    onAccessoriesClick?.();
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#2a2a2a] hover:bg-white/90 rounded-full shadow-lg px-4 py-2 text-sm md:text-base transition-all active:scale-95 cursor-pointer"
                  style={{
                    pointerEvents: 'auto',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'rgba(255,255,255,0.2)',
                    position: 'relative',
                    zIndex: 10, /* ensure overlay (z-90) and modal content (z-100) sit above */
                    border: 'none',
                    outline: 'none',
                  }}
                  type="button"
                >
                  Explorar Ahora
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
