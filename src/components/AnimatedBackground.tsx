import { motion } from "motion/react";

interface AnimatedBackgroundProps {
  darkMode: boolean;
}

// Generar posiciones aleatorias para copos de nieve (optimizado para rendimiento)
const generateSnowflakes = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 18 + Math.random() * 8,
    size: 2 + Math.random() * 3,
    opacity: 0.15 + Math.random() * 0.25, 
  }));
};

const snowflakes = generateSnowflakes(15);

export function AnimatedBackground({ darkMode }: AnimatedBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base background color */}
      <div className="absolute inset-0" style={{
        background: darkMode ? "#121212" : "#FDF7F2"
      }} />
      
      {/* Gradientes suaves animados */}
      <motion.div
        className="absolute w-[1000px] h-[1000px] rounded-full blur-[150px]"
        style={{
          background: darkMode
            ? "radial-gradient(circle, rgba(166, 108, 255, 0.4) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(212, 197, 226, 0.8) 0%, transparent 70%)",
          top: "-10%",
          left: "-10%",
          opacity: 0.7,
          willChange: "transform",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full blur-[130px]"
        style={{
          background: darkMode
            ? "radial-gradient(circle, rgba(0, 87, 255, 0.35) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(168, 213, 186, 0.75) 0%, transparent 70%)",
          top: "20%",
          right: "-5%",
          opacity: 0.6,
          willChange: "transform",
        }}
        animate={{
          x: [0, -60, 0],
          y: [0, 50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
        style={{
          background: darkMode
            ? "radial-gradient(circle, rgba(255, 95, 109, 0.3) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(244, 184, 196, 0.7) 0%, transparent 70%)",
          bottom: "10%",
          left: "30%",
          opacity: 0.55,
          willChange: "transform",
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-[110px]"
        style={{
          background: darkMode
            ? "radial-gradient(circle, rgba(255, 165, 0, 0.25) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(253, 220, 180, 0.8) 0%, transparent 70%)",
          bottom: "30%",
          right: "20%",
          opacity: 0.5,
          willChange: "transform",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
      />

      {/* Partículas sutiles flotantes (reducidas para mejor rendimiento) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full"
          style={{
            background: darkMode
              ? "rgba(166, 108, 255, 0.6)"
              : "rgba(212, 197, 226, 0.7)",
            top: `${20 + i * 13}%`,
            left: `${15 + i * 12}%`,
            boxShadow: darkMode
              ? "0 0 20px rgba(166, 108, 255, 0.4)"
              : "0 0 20px rgba(212, 197, 226, 0.5)",
            willChange: "transform, opacity",
          }}
          animate={{
            y: [0, -120, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 2.5, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.8,
          }}
        />
      ))}

      {/* Ondas sutiles */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: darkMode
            ? "linear-gradient(135deg, rgba(18, 18, 18, 0) 0%, rgba(166, 108, 255, 0.15) 50%, rgba(18, 18, 18, 0) 100%)"
            : "linear-gradient(135deg, rgba(253, 247, 242, 0) 0%, rgba(212, 197, 226, 0.5) 50%, rgba(253, 247, 242, 0) 100%)",
        }}
        animate={{
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mesh gradient overlay sutil */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: darkMode
            ? `
              radial-gradient(at 20% 30%, rgba(166, 108, 255, 0.35) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(0, 87, 255, 0.35) 0px, transparent 50%),
              radial-gradient(at 40% 80%, rgba(255, 95, 109, 0.35) 0px, transparent 50%)
            `
            : `
              radial-gradient(at 20% 30%, rgba(212, 197, 226, 0.6) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(168, 213, 186, 0.6) 0px, transparent 50%),
              radial-gradient(at 40% 80%, rgba(244, 184, 196, 0.6) 0px, transparent 50%)
            `,
        }}
      />

      {/* Efecto de nieve suave (optimizado) */}
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full"
          style={{
            left: `${flake.left}%`,
            top: "-10px",
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            background: darkMode
              ? `rgba(255, 255, 255, ${flake.opacity * 1.5})`
              : `rgba(166, 108, 255, ${flake.opacity * 1.3})`,
            boxShadow: darkMode
              ? `0 0 ${flake.size * 3}px rgba(255, 255, 255, ${flake.opacity * 0.8})`
              : `0 0 ${flake.size * 3}px rgba(166, 108, 255, ${flake.opacity * 0.7})`,
            willChange: "transform, opacity",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(flake.id) * 50, 0],
            opacity: [0, flake.opacity * 1.2, flake.opacity * 1.2, 0],
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
