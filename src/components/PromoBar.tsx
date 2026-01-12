import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export function PromoBar() {
  const [visible, setVisible] = useState(true);
  const [currentPromo, setCurrentPromo] = useState(0);

  const promos = [
    "🎉 Envío gratis en compras mayores a $50",
    "✨ 20% de descuento en toda la colección de invierno",
    "🔥 Nueva colección primavera-verano disponible",
    "💝 Regala estilo - Tarjetas de regalo disponibles",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // expose current promo bar height to CSS variable so header can position itself below it
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    const setHeight = (h: number) => {
      document.documentElement.style.setProperty("--promo-height", `${h}px`);
    };

    if (!el) return;

    // IntersectionObserver: only set promo-height when the promo bar is actually visible in the viewport
  let observer: IntersectionObserver | null = null;
  const timeoutRef: { current: number | null } = { current: null };
  const resizeObserver = new ResizeObserver(() => {
      // update height when size changes and element is intersecting
      // we'll read the computed --promo-height to decide if currently set
      const current = getComputedStyle(document.documentElement).getPropertyValue("--promo-height").trim();
      if (current && current !== "0px") {
        setHeight(el.offsetHeight);
      }
    });

    const onIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && visible) {
          // promo is in view -> clear any pending hide and set height to its offsetHeight
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setHeight(el.offsetHeight);
        } else {
          // promo out of view -> wait a small debounce before hiding to avoid visual flicker
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = window.setTimeout(() => {
            setHeight(0);
            timeoutRef.current = null;
          }, 150);
        }
      });
    };

    observer = new IntersectionObserver(onIntersect, { root: null, threshold: 0 });
    observer.observe(el);
    resizeObserver.observe(el);

    // when hiding (user closed), wait for exit animation then set to 0
    if (!visible) {
      const t = setTimeout(() => setHeight(0), 320);
      return () => {
        clearTimeout(t);
        observer?.disconnect();
        resizeObserver.disconnect();
      };
    }

    return () => {
      observer?.disconnect();
      resizeObserver.disconnect();
    };
  }, [visible, currentPromo]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          initial={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="py-2 px-4 relative overflow-hidden"
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
        >
          <div className="container mx-auto flex items-center justify-center gap-2">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPromo}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center text-sm sm:text-base"
              >
                {promos[currentPromo]}
              </motion.p>
            </AnimatePresence>
            <button
              onClick={() => setVisible(false)}
              className="absolute right-4 hover:opacity-70 transition-opacity"
              aria-label="Cerrar banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
