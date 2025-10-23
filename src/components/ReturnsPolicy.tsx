import { motion } from "motion/react";
import { RotateCcw, Calendar, CheckCircle2, Package, FileText, Headphones } from "lucide-react";
import { Card } from "./ui/card";
import { ScrollReveal } from "./ScrollReveal";

export function ReturnsPolicy() {
  const steps = [
    {
      icon: Calendar,
      title: "30 Días de Garantía",
      description: "Tienes hasta 30 días desde la recepción del producto para realizar cambios o devoluciones.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Package,
      title: "Empaque Original",
      description: "El producto debe estar sin usar, con etiquetas originales y en su empaque original.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FileText,
      title: "Solicita tu Devolución",
      description: "Contáctanos por WhatsApp o email con tu número de pedido para iniciar el proceso.",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: CheckCircle2,
      title: "Reembolso Rápido",
      description: "Una vez recibido y verificado el producto, procesamos tu reembolso en 5-7 días hábiles.",
      color: "from-green-500 to-green-600",
    },
  ];

  const policies = [
    {
      title: "Productos Elegibles",
      items: [
        "Toda la ropa y accesorios sin usar",
        "Productos en su empaque original",
        "Artículos con etiquetas intactas",
        "Compras realizadas en los últimos 30 días",
      ],
    },
    {
      title: "Productos No Elegibles",
      items: [
        "Ropa interior por razones de higiene",
        "Productos personalizados o hechos a medida",
        "Artículos en oferta especial (indicados)",
        "Productos dañados por mal uso",
      ],
    },
  ];

  return (
    <section id="returns-policy" className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
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
            <RotateCcw className="w-5 h-5 text-primary" />
            <span className="text-primary">Compra sin Preocupaciones</span>
          </motion.div>
          
          <ScrollReveal delay={0.2}>
            <h2 className="mb-4 text-4xl md:text-5xl">Cambios y Devoluciones</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Tu satisfacción es nuestra prioridad. Proceso simple y rápido para cambios y devoluciones
            </p>
          </ScrollReveal>
        </motion.div>

        {/* Steps Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  bounce: 0.5
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative"
              >
                <Card className="p-6 h-full bg-card hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 relative overflow-hidden group">
                  {/* Number badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    className="absolute top-4 right-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm text-primary"
                  >
                    {index + 1}
                  </motion.div>

                  {/* Animated background gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg relative z-10`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h4 className="mb-2 relative z-10">{step.title}</h4>
                  <p className="text-sm text-muted-foreground relative z-10">
                    {step.description}
                  </p>

                  {/* Connection line for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary/40 to-transparent" />
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {policies.map((policy, policyIndex) => (
            <motion.div
              key={policy.title}
              initial={{ opacity: 0, x: policyIndex === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 h-full bg-gradient-to-br from-card to-muted/20 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-xl">
                <h3 className="mb-6 flex items-center gap-2">
                  {policyIndex === 0 ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center">
                      <span className="text-red-500 text-lg leading-none">×</span>
                    </div>
                  )}
                  {policy.title}
                </h3>
                <ul className="space-y-3">
                  {policy.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + itemIndex * 0.1 }}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        policyIndex === 0 ? "bg-green-500" : "bg-red-500"
                      }`} />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative overflow-hidden"
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/20 relative overflow-hidden">
            {/* Animated background circles */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl"
            />
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-xl"
              >
                <Headphones className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="mb-4">¿Necesitas Ayuda?</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Nuestro equipo de atención al cliente está disponible 24/7 para ayudarte con cualquier
                consulta sobre cambios, devoluciones o estado de tu pedido.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full hover:shadow-xl transition-all"
                >
                  <Headphones className="w-5 h-5" />
                  Contactar Soporte
                </motion.a>
                
                <motion.a
                  href="mailto:soporte@estilo.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-background border-2 border-primary text-primary rounded-full hover:shadow-xl transition-all"
                >
                  <FileText className="w-5 h-5" />
                  Enviar Email
                </motion.a>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
