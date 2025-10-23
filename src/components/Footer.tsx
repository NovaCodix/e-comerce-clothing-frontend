import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";

interface FooterProps {
  onOpenSizeGuide?: () => void;
}

export function Footer({ onOpenSizeGuide }: FooterProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const footerSections = [
    {
      title: "Compañía",
      links: [
        { label: "Sobre Nosotros", action: () => scrollToSection("about-section") },
        { label: "Testimonios", action: () => scrollToSection("testimonials-section") },
        { label: "Categorías", action: () => scrollToSection("categories-section") },
        { label: "Instagram", action: () => scrollToSection("instagram-section") },
      ],
    },
    {
      title: "Ayuda",
      links: [
        { label: "Servicio al Cliente", action: () => window.open("https://wa.me/1234567890", "_blank") },
        { label: "Guía de Tallas", action: () => onOpenSizeGuide?.() },
        { label: "Cambios y Devoluciones", action: () => scrollToSection("returns-policy") },
        { label: "Beneficios", action: () => scrollToSection("benefits-section") },
      ],
    },
    {
      title: "Categorías",
      links: [
        { label: "Productos Destacados", action: () => scrollToSection("trending-section") },
        { label: "Colecciones", action: () => scrollToSection("collection-section") },
        { label: "Newsletter", action: () => scrollToSection("newsletter-section") },
        { label: "Ver Todo", action: () => scrollToSection("products-section") },
      ],
    },
  ];

  return (
    <footer 
      className="bg-[#2a2a2a] text-white mt-auto w-full" 
      style={{ paddingBottom: 'max(3rem, env(safe-area-inset-bottom))' }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#b8a89a] rounded-lg flex items-center justify-center">
                <span>✨</span>
              </div>
              <span className="">ESTILO</span>
            </div>
            <p className="text-white/70 mb-6">
              Tu destino para moda moderna y elegante. Descubre prendas únicas que expresan tu personalidad.
            </p>
            
            {/* Newsletter */}
            <div>
              <h4 className="mb-3">Suscríbete a nuestro Newsletter</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button className="bg-[#b8a89a] hover:bg-[#a89888] flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button 
                      onClick={link.action}
                      className="text-white/70 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/70">
            © 2025 ESTILO. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
              <Facebook className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
              <Instagram className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
              <Youtube className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
