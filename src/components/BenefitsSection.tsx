import { motion } from "motion/react";
import { Truck, RotateCcw, Shield, Headphones } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: Truck,
      title: "Envío Gratis",
      description: "En compras superiores a S/ 50",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: RotateCcw,
      title: "Devoluciones Fáciles",
      description: "30 días para cambios y devoluciones",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Shield,
      title: "Pago Seguro",
      description: "Tus datos están protegidos",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Headphones,
      title: "Soporte 24/7",
      description: "Estamos aquí para ayudarte",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.08,
                  ease: [0.42, 0, 0.58, 1]
                }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border overflow-hidden"
                style={{ willChange: "transform, opacity" }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  initial={false}
                />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  <h4 className="mb-2 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
