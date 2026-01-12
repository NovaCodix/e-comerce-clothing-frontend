import { motion } from "motion/react";
import { Heart, Users, Sparkles, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AnimatedCounter } from "./AnimatedCounter";
import { ScrollReveal } from "./ScrollReveal";

export function AboutSection() {
  const values = [
    {
      icon: Heart,
      title: "Pasión por la Moda",
      description: "Creemos que la moda es una forma de expresión personal y empoderamiento.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Construimos una comunidad inclusiva donde todos pueden encontrar su estilo único.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Sparkles,
      title: "Calidad Premium",
      description: "Seleccionamos cuidadosamente cada pieza para garantizar la mejor calidad.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Award,
      title: "Sostenibilidad",
      description: "Comprometidos con prácticas éticas y responsables con el medio ambiente.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section id="about-section" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary/10 px-5 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary">Nuestra Historia</span>
          </motion.div>

          <ScrollReveal delay={0.2}>
            <h2 className="mb-6 text-4xl md:text-5xl">Sobre ESTILO</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
              Desde 2020, ESTILO ha sido más que una tienda de moda. Somos una comunidad apasionada 
              por ayudar a las personas a descubrir y expresar su estilo único. Cada prenda que ofrecemos 
              cuenta una historia de calidad, diseño excepcional y compromiso con nuestros clientes.
            </p>
          </ScrollReveal>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { number: 50, suffix: "K+", label: "Clientes Felices" },
            { number: 1000, suffix: "+", label: "Productos" },
            { number: 98, suffix: "%", label: "Satisfacción" },
            { number: 24, suffix: "/7", label: "Soporte" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring", bounce: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-4xl md:text-5xl text-primary mb-2">
                <AnimatedCounter value={stat.number} suffix={stat.suffix} duration={2} />
              </h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <ScrollReveal delay={0.2}>
            <h3 className="text-center mb-12 text-3xl">
              Nuestros Valores
            </h3>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring",
                    bounce: 0.4
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-card p-6 rounded-2xl border border-border hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  {/* Background gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-lg relative z-10`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>

                  <h4 className="mb-2 relative z-10 group-hover:text-primary transition-colors">
                    {value.title}
                  </h4>
                  <p className="text-sm text-muted-foreground relative z-10">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80",
            "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
          ].map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group"
            >
              <ImageWithFallback
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
