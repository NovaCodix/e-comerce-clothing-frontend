import { Button } from "./ui/button";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronDown, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const scrollToContent = () => {
    // Si estamos en home, scroll normal
    if (location.pathname === '/') {
      try {
        const categoriesSection = document.getElementById('categories-section');
        if (categoriesSection) {
          categoriesSection.scrollIntoView({ 
            behavior: "smooth", 
            block: "start",
            inline: "nearest"
          });
        } else {
          const scrollTarget = Math.min(window.innerHeight * 0.85, document.body.scrollHeight);
          window.scrollTo({
            top: scrollTarget,
            behavior: "smooth",
          });
        }
      } catch (error) {
        const categoriesSection = document.getElementById('categories-section');
        if (categoriesSection) {
          categoriesSection.scrollIntoView(true);
        }
      }
    } else {
      // Si no, navegar a colección
      navigate('/coleccion');
    }
  };

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-[#f5ebe0]">
      {/* Animated background image */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0 pointer-events-none"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1620777888789-0ee95b57a277?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBjbG90aGluZ3xlbnwxfHx8fDE3NjA5Nzk2OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Hero fashion"
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Animated gradient overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none"
      />

      {/* Floating particles effect */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full pointer-events-none"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: "50%",
            willChange: "transform, opacity",
          }}
        />
      ))}
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center text-white px-4 max-w-4xl pointer-events-auto"
        >
          {/* Sparkle badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Nueva Colección 2024</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
            className="mb-6 text-5xl md:text-6xl lg:text-7xl drop-shadow-2xl"
          >
            Exprésate con Estilo
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
            className="mb-10 text-white/90 max-w-2xl mx-auto text-lg md:text-xl drop-shadow-lg"
          >
            Descubre nuestra colección exclusiva de moda contemporánea. 
            Diseños únicos que reflejan tu personalidad.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0 pointer-events-auto"
          >
            <Button
              size="lg"
              onClick={scrollToContent}
              className="w-full sm:w-auto bg-white text-[#2a2a2a] hover:bg-white/90 rounded-full px-8 sm:px-10 py-5 sm:py-6 shadow-2xl hover:shadow-3xl transition-all text-base sm:text-lg active:scale-95 cursor-pointer z-20"
            >
              Explorar Ahora
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToContent}
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg active:scale-95 cursor-pointer z-20"
            >
              Ver Ofertas
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer pointer-events-auto z-10"
        onClick={scrollToContent}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-white/80 hover:text-white transition-colors"
        >
          <span className="text-sm mb-2">Desliza para ver más</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
