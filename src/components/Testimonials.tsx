import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Testimonials() {
  const testimonials = [
    {
      name: "María García",
      role: "Cliente Frecuente",
      rating: 5,
      comment: "La calidad de la ropa es excepcional. Siempre encuentro prendas únicas que me encantan. El servicio de entrega es súper rápido!",
      avatar: "MG",
      color: "bg-purple-500",
    },
    {
      name: "Carlos Rodríguez",
      role: "Comprador Verificado",
      rating: 5,
      comment: "Excelente experiencia de compra. La atención al cliente es de primera y los productos llegan en perfectas condiciones.",
      avatar: "CR",
      color: "bg-blue-500",
    },
    {
      name: "Ana López",
      role: "Cliente VIP",
      rating: 5,
      comment: "Me encanta la variedad de estilos. Siempre hay algo nuevo y las ofertas son increíbles. Totalmente recomendado!",
      avatar: "AL",
      color: "bg-pink-500",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Miles de clientes satisfechos confían en nosotros
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.42, 0, 0.58, 1] }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border relative overflow-hidden"
              style={{ willChange: "transform, opacity" }}
            >
              {/* Quote decoration */}
              <motion.div
                initial={{ opacity: 0.05 }}
                whileHover={{ opacity: 0.1, rotate: 10 }}
                className="absolute top-6 right-6"
              >
                <Quote className="w-16 h-16 text-primary" />
              </motion.div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08, ease: [0.42, 0, 0.58, 1] }}
                  >
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>

              {/* Comment */}
              <p className="text-muted-foreground mb-6 relative z-10 italic">
                "{testimonial.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 relative z-10">
                <Avatar className={`${testimonial.color} border-2 border-white shadow-md`}>
                  <AvatarFallback className="text-white">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Animated background effect */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.15, duration: 0.8 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
