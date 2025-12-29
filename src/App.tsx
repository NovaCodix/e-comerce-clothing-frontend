import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { PromoBar } from "./components/PromoBar";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Collection } from "./pages/Collection";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartDrawer, CartItem } from "./components/CartDrawer";
import { FavoritesDrawer } from "./components/FavoritesDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { AuthModal } from "./components/AuthModal";
import { Order } from "./components/OrderTracker";
import OrderTrackerPage from "./pages/OrderTrackerPage";
import { SizeGuide } from "./components/SizeGuide";
import { SpringCollection } from "./components/SpringCollection";
import { AccessoriesCollection } from "./components/AccessoriesCollection";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { Product } from "./components/ProductCard";
import { ScrollToTop } from "./components/ScrollToTop";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./components/ui/sheet";
import { toast, Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { useCart } from "./lib/supabase/hooks/useCart";
// import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
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

  // 1. AQUI ESTABA EL ERROR: Ahora usamos 'products' en lugar de 'mockProducts'
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
          id: dbItem.id, // Ahora es un UUID (string)
          name: dbItem.name,
          price: Number(dbItem.basePrice), // Asegurar que sea número
          originalPrice: dbItem.discountPrice ? Number(dbItem.basePrice) : undefined,
          // Si tiene imágenes, usa la primera, si no, una por defecto
          image: dbItem.images.length > 0 ? dbItem.images[0].url : 'https://via.placeholder.com/300',
          category: dbItem.category?.name || 'General',
          // Mapeamos las variantes para sacar tallas y colores únicos
          sizes: [...new Set(dbItem.variants.map((v: any) => v.size))],
          colors: [...new Set(dbItem.variants.map((v: any) => v.color))],
          isNew: dbItem.isNewArrival,
          isSale: dbItem.discountPrice !== null,
          materialInfo: dbItem.materialInfo,
          shippingInfo: dbItem.shippingInfo,
        }));

        setProducts(mappedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error conectando al servidor:", err);
        setLoading(false);
      });
  }, []);

  // Mock order for demonstration (Esto se queda igual porque es demo)
  const [currentOrder] = useState<Order>({
    id: "1",
    orderNumber: "EST-2024-00123",
    status: "in-transit",
    items: [
      { name: "Vestido Elegante Lavanda", quantity: 1 },
      { name: "Accesorios Premium", quantity: 2 },
    ],
    total: 189.97,
    createdAt: new Date(2024, 9, 20),
    estimatedDelivery: new Date(2024, 9, 25),
    trackingSteps: [
      { label: "Pedido confirmado", completed: true, date: new Date(2024, 9, 20, 10, 30) },
      { label: "Preparando envío", completed: true, date: new Date(2024, 9, 20, 14, 15) },
      { label: "En camino", completed: true, date: new Date(2024, 9, 21, 8, 45) },
      { label: "Entregado", completed: false },
    ],
  });

  const pastOrder: Order = {
    id: "2",
    orderNumber: "PO-159-00737",
    status: "delivered",
    items: [{ name: "Accesorios Premium", quantity: 2 }],
    total: 152.25,
    createdAt: new Date(2024, 4, 3),
    estimatedDelivery: new Date(2024, 4, 9),
    trackingSteps: [
      { label: "Pedido confirmado", completed: true, date: new Date(2024, 4, 1, 9, 0) },
      { label: "En camino", completed: true, date: new Date(2024, 4, 5, 12, 0) },
      { label: "Entregado", completed: true, date: new Date(2024, 4, 9, 15, 30) }
    ],
  };

  const ordersForTracker: Order[] = [currentOrder, pastOrder];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAddToCart = async (product: Product, size?: string) => {
    await addToCart(product, size);
    toast.success(`${product.name} agregado al carrito`, {
      description: `Talla: ${size || product.sizes[0] || 'Única'}`,
    });
  };

  // 2. CORREGIDO: Usar 'products' en lugar de 'mockProducts'
  const handleAddToCartByName = (productName: string) => {
    const found = products.find((p) => p.name === productName);
    if (found) {
      handleAddToCart(found);
      setIsCartOpen(true);
    } else {
      toast.error(`Producto '${productName}' no encontrado en catálogo`);
    }
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

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = cartTotal > 50 ? 0 : 5;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shipping + tax;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando tienda...</div>;
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
          products={products} // 3. CORREGIDO: Pasar 'products'
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
                products={products} // 4. CORREGIDO: Pasar 'products'
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
                products={products} // 5. CORREGIDO: Pasar 'products'
                selectedCategory={selectedCategory}
                onAddToCart={handleAddToCart}
                onViewDetails={setSelectedProduct}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
              />
            } 
          />
          
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
          onAddToCart={(product, size) => handleAddToCart(product, size)}
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
          // 6. CORREGIDO: Filtrar sobre 'products' y asegurar que la comparación sea por número
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
          products={products} // 7. CORREGIDO: Pasar 'products'
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoriteIds}
        />

        <AccessoriesCollection
          open={isAccessoriesCollectionOpen}
          onClose={() => setIsAccessoriesCollectionOpen(false)}
          products={products} // 8. CORREGIDO: Pasar 'products'
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoriteIds}
        />

        <WhatsAppButton />
      </div>
    </Router>
  );
}