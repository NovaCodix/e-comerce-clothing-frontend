import { motion } from "motion/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ScrollReveal } from "./ScrollReveal";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("¡Suscripción exitosa!", {
        description: "Recibirás nuestras últimas novedades y ofertas exclusivas",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-white">
      {/* Animated background */}
      <div className="absolute inset-0 bg-white" />
      
      {/* Animated circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.42, 0, 0.58, 1] }}
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm">Ofertas Exclusivas</span>
          </motion.div>

          <h2 className="mb-4">Suscríbete a Nuestro Newsletter</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Recibe las últimas tendencias, ofertas especiales y descuentos exclusivos
            directamente en tu bandeja de entrada
          </p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-12 rounded-full border-2 focus:border-primary"
                required
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
            >
              Suscribirse
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-xs text-muted-foreground mt-4"
          >
            Al suscribirte, aceptas recibir correos de marketing. Puedes darte de baja
            en cualquier momento.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
