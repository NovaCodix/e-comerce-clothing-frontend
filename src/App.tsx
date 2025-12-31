import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { PromoBar } from "./components/PromoBar";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Collection } from "./pages/Collection";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartDrawer } from "./components/CartDrawer";
import { FavoritesDrawer } from "./components/FavoritesDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { AuthModal } from "./components/AuthModal";
import { SizeGuide } from "./components/SizeGuide";
import { SpringCollection } from "./components/SpringCollection";
import { AccessoriesCollection } from "./components/AccessoriesCollection";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { Product } from "./components/ProductCard";
import { ScrollToTop } from "./components/ScrollToTop";
import { toast, Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { useCart } from "./lib/supabase/hooks/useCart";
import CreateProduct from './pages/CreateProduct';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  // ESTADO PARA PRODUCTOS REALES DE LA BASE DE DATOS
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true);

  // Hook del carrito usando los productos reales
  const { cartItems, addToCart, updateQuantity, removeItem } = useCart(products);
  
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSpringCollectionOpen, setIsSpringCollectionOpen] = useState(false);
  const [isAccessoriesCollectionOpen, setIsAccessoriesCollectionOpen] = useState(false);

  // CARGAR DATOS DE LA BASE DE DATOS
  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then((data) => {
        // TRANSFORMACIÓN: Convertir formato Base de Datos -> Formato Frontend
        const mappedProducts: Product[] = data.map((dbItem: any) => ({
          id: dbItem.id, // ID es string (UUID)
          name: dbItem.name,
          
          // PRECIOS
          price: Number(dbItem.basePrice), 
          // Si hay descuento, el original es el basePrice
          originalPrice: dbItem.discountPrice ? Number(dbItem.basePrice) : undefined,
          // El precio con descuento (si existe)
          discountPrice: dbItem.discountPrice ? Number(dbItem.discountPrice) : undefined,

          // IMAGEN
          image: dbItem.images.length > 0 ? dbItem.images[0].url : 'https://via.placeholder.com/300',
          
          // CATEGORÍA (Tipo de prenda: Pantalones, Camisas...)
          category: dbItem.category?.name || 'General',
          
          // GÉNERO (Sección: Hombre, Mujer...) <--- ¡ESTO ES LO NUEVO IMPORTANTE!
          gender: dbItem.gender || 'Unisex',

          // LISTAS PARA FILTROS (Sets únicos)
          sizes: [...new Set(dbItem.variants.map((v: any) => v.size))],
          colors: [...new Set(dbItem.variants.map((v: any) => v.color))],
          
          // DATOS COMPLETOS
          variants: dbItem.variants,       // Array completo con stock real
          description: dbItem.description, // Texto de descripción
          materialInfo: dbItem.materialInfo, // Texto de materiales
          shippingInfo: dbItem.shippingInfo, // Texto de envíos
          isActive: dbItem.isActive,       // Estado activo/inactivo

          isNew: dbItem.isNewArrival,
          isSale: dbItem.discountPrice !== null, 
        }));

        setProducts(mappedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error conectando al servidor:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Actualizado para soportar color
  const handleAddToCart = async (product: Product, size?: string, color?: string) => {
    // Si no viene talla/color (desde tarjeta rápida), usamos los primeros disponibles como fallback
    const finalSize = size || (product.sizes.length > 0 ? product.sizes[0] : "Única");
    
    await addToCart(product, finalSize); 
    
    toast.success(`${product.name} agregado al carrito`, {
      description: `Talla: ${finalSize} ${color ? `- Color: ${color}` : ''}`,
    });
  };

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    await updateQuantity(id, quantity);
  };

  const handleRemoveItem = async (id: number) => {
    await removeItem(id);
    toast.success("Producto eliminado del carrito");
  };

  const handleToggleFavorite = (id: number) => {
    if (favoriteIds.includes(id)) {
      setFavoriteIds(favoriteIds.filter((favId) => favId !== id));
      toast.success("Producto eliminado de favoritos");
    } else {
      setFavoriteIds([...favoriteIds, id]);
      toast.success("Producto agregado a favoritos");
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Cálculo de totales
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );
  const shipping = cartTotal > 200 ? 0 : 15; // Envío gratis > 200 (ejemplo)
  const total = cartTotal + shipping;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Cargando tienda...</div>;
  }

  return (
    <Router>
      <Toaster position="top-center" richColors />
      
      <AnimatedBackground darkMode={darkMode} />
      
      <div className="min-h-screen bg-background/50 flex flex-col w-full">
        <PromoBar />
        
        <Header
          onCartClick={() => setIsCartOpen(true)}
          onAuthClick={() => setIsAuthOpen(true)}
          onFavoritesClick={() => setIsFavoritesOpen(true)}
          onOrderTrackingClick={() => {}}
          cartItemCount={cartItems.length}
          favoriteCount={favoriteIds.length}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(!darkMode)}
          products={products}
          onSelectProduct={setSelectedProduct}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        <ScrollToTop />
        <Routes>
          <Route 
            path="/" 
            element={
              <Home
                // Filtramos solo productos activos
                products={products.filter(p => p.isActive !== false)} 
                onCategorySelect={handleCategorySelect}
                onAddToCart={handleAddToCart}
                onViewDetails={setSelectedProduct}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                onSpringCollectionOpen={() => setIsSpringCollectionOpen(true)}
                onAccessoriesCollectionOpen={() => setIsAccessoriesCollectionOpen(true)}
              />
            } 
          />
          <Route 
            path="/coleccion" 
            element={
              <Collection
                products={products.filter(p => p.isActive !== false)}
                selectedCategory={selectedCategory}
                onAddToCart={handleAddToCart}
                onViewDetails={setSelectedProduct}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
              />
            } 
          />
          
          {/* Ruta Admin */}
          <Route path="/admin/create-product" element={<CreateProduct />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <div aria-hidden="true" className="h-12 md:h-20" />
        <Footer onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />

        {/* Modals and drawers */}
        <ProductDetailModal
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          // Conversión segura de ID para favoritos (ya que BD usa string UUID y favoritos array de numbers)
          isFavorite={selectedProduct ? favoriteIds.includes(Number(selectedProduct.id)) : false}
          onToggleFavorite={handleToggleFavorite}
        />

        <CartDrawer
          open={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />

        <FavoritesDrawer
          open={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
          favorites={products.filter((p) => favoriteIds.includes(Number(p.id)))}
          onRemoveFavorite={handleToggleFavorite}
          onViewDetails={setSelectedProduct}
          onAddToCart={(product) => handleAddToCart(product)}
        />

        <CheckoutModal
          open={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={cartItems}
          total={total}
          onAuthRequired={() => {
            setIsCheckoutOpen(false);
            setIsAuthOpen(true);
            toast.error("Debes iniciar sesión para realizar el pago");
          }}
        />

        <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

        <SizeGuide
          open={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
        />

        <SpringCollection
          open={isSpringCollectionOpen}
          onClose={() => setIsSpringCollectionOpen(false)}
          products={products}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoriteIds}
        />

        <AccessoriesCollection
          open={isAccessoriesCollectionOpen}
          onClose={() => setIsAccessoriesCollectionOpen(false)}
          products={products}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoriteIds}
        />

        <WhatsAppButton />
      </div>
    </Router>
  );
}