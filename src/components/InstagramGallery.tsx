import { motion } from "motion/react";
import { Instagram, Heart, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function InstagramGallery() {
  const instagramPosts = [
    {
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
      likes: 245,
      comments: 18,
    },
    {
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
      likes: 892,
      comments: 45,
    },
    {
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
      likes: 567,
      comments: 32,
    },
    {
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
      likes: 423,
      comments: 21,
    },
    {
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
      likes: 678,
      comments: 39,
    },
    {
      image: "https://images.unsplash.com/photo-1558769132-cb1aea1f8565?w=600&q=80",
      likes: 334,
      comments: 15,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="w-8 h-8 text-pink-500" />
            <h2>Síguenos en Instagram</h2>
          </div>
          <p className="text-muted-foreground">
            @estilo_oficial - Únete a nuestra comunidad de moda
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.42, 0, 0.58, 1] }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              style={{ willChange: "transform, opacity" }}
            >
              <ImageWithFallback
                src={post.image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center gap-4 p-4"
              >
                <Instagram className="w-8 h-8 text-white" />
                <div className="flex items-center gap-4 text-white text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </motion.div>

              {/* Corner decoration */}
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-white/50 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-full hover:shadow-lg transition-all"
          >
            <Instagram className="w-5 h-5" />
            Seguir @estilo_oficial
          </a>
        </motion.div>
      </div>
    </section>
  );
}
