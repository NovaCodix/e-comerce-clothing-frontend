import { Hero } from "../components/Hero";
import { FeaturedCategories } from "../components/FeaturedCategories";
import { BenefitsSection } from "../components/BenefitsSection";
import { TrendingProducts } from "../components/TrendingProducts";
import { CollectionBanner } from "../components/CollectionBanner";
import { AboutSection } from "../components/AboutSection";
import { ReturnsPolicy } from "../components/ReturnsPolicy";
import { Testimonials } from "../components/Testimonials";
import { NewsletterSection } from "../components/NewsletterSection";
import { InstagramGallery } from "../components/InstagramGallery";
import { Product } from "../components/ProductCard";
// navigation is handled inside FeaturedCategories (it will call the provided onCategoryClick
// and then navigate to /coleccion). No need to import useNavigate here.

interface HomeProps {
  products: Product[];
  onAddToCart: (product: Product, size?: string) => void;
  onViewDetails: (product: Product) => void;
  favoriteIds: number[];
  onToggleFavorite: (productId: number) => void;
  onSpringCollectionOpen: () => void;
  onAccessoriesCollectionOpen: () => void;
  onCategorySelect: (category: string) => void;
}

export function Home({
  products,
  onAddToCart,
  onViewDetails,
  favoriteIds,
  onToggleFavorite,
  onSpringCollectionOpen,
  onAccessoriesCollectionOpen,
  onCategorySelect,
}: HomeProps) {

  return (
    <>
      {/* Hero */}
      <div id="hero-section">
        <Hero />
      </div>

      {/* Featured Categories */}
      <div id="categories-section">
        <FeaturedCategories onCategoryClick={onCategorySelect} />
      </div>

      {/* Benefits Section */}
      <div id="benefits-section">
        <BenefitsSection />
      </div>

      {/* Trending Products */}
      <div id="trending-section">
        <TrendingProducts
          products={products}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
          favoriteIds={favoriteIds}
          onToggleFavorite={onToggleFavorite}
        />
      </div>

      {/* Collection Banner */}
      <div id="collection-section">
        <CollectionBanner 
          onSpringClick={onSpringCollectionOpen}
          onAccessoriesClick={onAccessoriesCollectionOpen}
        />
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Returns Policy */}
      <ReturnsPolicy />

      {/* Testimonials */}
      <div id="testimonials-section">
        <Testimonials />
      </div>

      {/* Newsletter */}
      <div id="newsletter-section">
        <NewsletterSection />
      </div>

      {/* Instagram Gallery */}
      <div id="instagram-section">
        <InstagramGallery />
      </div>
    </>
  );
}
