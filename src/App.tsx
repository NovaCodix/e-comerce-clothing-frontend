import { useState, useEffect, useCallback } from "react";
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
import AdminLogin from './pages/AdminLogin';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

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
  
  const [favoriteIds, setFavoriteIds] = useState<(string | number)[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSpringCollectionOpen, setIsSpringCollectionOpen] = useState(false);
  const [isAccessoriesCollectionOpen, setIsAccessoriesCollectionOpen] = useState(false);

  // Cargar favoritos desde localStorage al inicio
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavoriteIds(JSON.parse(savedFavorites));
      } catch (err) {
        console.error('Error al cargar favoritos:', err);
      }
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    if (favoriteIds.length >= 0) {
      localStorage.setItem('favorites', JSON.stringify(favoriteIds));
    }
  }, [favoriteIds]);

  // FUNCIÓN PARA CARGAR/RECARGAR PRODUCTOS
  const loadProducts = useCallback(() => {
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
          images: dbItem.images || [],      // ← AGREGADO: Array completo de imágenes con colores
          variants: dbItem.variants,       // Array completo con stock real
          description: dbItem.description, // Texto de descripción
          materialInfo: dbItem.materialInfo, // Texto de materiales
          shippingInfo: dbItem.shippingInfo, // Texto de envíos
          isActive: dbItem.isActive,       // Estado activo/inactivo

          isNew: dbItem.isNewArrival,
          isSale: dbItem.discountPrice !== null,
          isTrending: dbItem.isTrending,   // ← AGREGADO: Campo de productos en tendencia
          isFeatured: dbItem.isFeatured,   // ← AGREGADO: Campo de productos destacados
        }));

        setProducts(mappedProducts);
        
        // LIMPIAR FAVORITOS HUÉRFANOS: Eliminar IDs que ya no existen
        const validProductIds = new Set(mappedProducts.map(p => String(p.id)));
        setFavoriteIds(prevFavorites => {
          const cleanedFavorites = prevFavorites.filter(id => validProductIds.has(String(id)));
          // Si se eliminaron favoritos, actualizar localStorage
          if (cleanedFavorites.length !== prevFavorites.length) {
            localStorage.setItem('favorites', JSON.stringify(cleanedFavorites));
          }
          return cleanedFavorites;
        });
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Error conectando al servidor:", err);
        setLoading(false);
      });
  }, []);

  // CARGAR DATOS DE LA BASE DE DATOS AL MONTAR
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ESCUCHAR EVENTO PERSONALIZADO PARA RECARGAR PRODUCTOS
  useEffect(() => {
    const handleRefresh = () => {
      loadProducts();
    };
    
    window.addEventListener('refreshProducts', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshProducts', handleRefresh);
    };
  }, [loadProducts]);

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
    const finalColor = color || (product.colors.length > 0 ? product.colors[0] : "Sin especificar");
    
    await addToCart(product, finalSize, finalColor); 
    
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    await updateQuantity(id, quantity);
  };

  const handleRemoveItem = async (id: number) => {
    await removeItem(id);
    toast.success("Producto eliminado del carrito");
  };

  const handleToggleFavorite = (id: number | string) => {
    const stringId = String(id);
    if (favoriteIds.some(favId => String(favId) === stringId)) {
      setFavoriteIds(favoriteIds.filter((favId) => String(favId) !== stringId));
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

  // Cálculo de totales (los precios ya incluyen todo)
  const total = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Cargando tienda...</div>;
  }

  return (
    <Router>
      <Toaster position="top-center" richColors />
      
      <Routes>
        {/* Rutas de Administración (SIN Layout de tienda) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedAdminRoute>
              <CreateProduct />
            </ProtectedAdminRoute>
          } 
        />

        {/* Rutas Públicas (CON Layout de tienda) */}
        <Route
          path="/*"
          element={
            <>
              <AnimatedBackground darkMode={darkMode} />
              
              <PromoBar />
              
              <div className="min-h-screen bg-white flex flex-col w-full">
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
                        onCategoryChange={handleCategorySelect}
                      />
                    } 
                  />
                  
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
                  isFavorite={selectedProduct ? favoriteIds.some(favId => String(favId) === String(selectedProduct.id)) : false}
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
                  favorites={products.filter((p) => favoriteIds.some(favId => String(favId) === String(p.id)))}
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
                  onCheckoutSuccess={() => {
                    // Limpiar el carrito después de un checkout exitoso
                    localStorage.removeItem('cart');
                    window.location.reload(); // Recargar para limpiar el estado
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
            </>
          }
        />
      </Routes>
    </Router>
  );
}