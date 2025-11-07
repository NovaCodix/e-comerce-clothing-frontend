import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PromoBar } from "./components/PromoBar";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Collection } from "./pages/Collection";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartDrawer, CartItem } from "./components/CartDrawer";
import { FavoritesDrawer } from "./components/FavoritesDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { AuthModal } from "./components/AuthModal";
import { OrderTracker, Order } from "./components/OrderTracker";
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

// Mock products data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Vestido Elegante Lavanda",
    price: 89.99,
    originalPrice: 120.00,
    image: "https://images.unsplash.com/photo-1751399566412-ad1194241c5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHN0eWxpc2glMjBvdXRmaXR8ZW58MXx8fHwxNzYxMDg0OTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Vestidos",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#d4c5e2", "#ffffff", "#2a2a2a"],
    isNew: true,
    isSale: true,
  },
  {
    id: 2,
    name: "Chaqueta Casual Beige",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1637641185564-9edb317d6f65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwamFja2V0fGVufDF8fHx8MTc2MTA4NDk5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Chaquetas",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#f5ebe0", "#e5e5e5", "#2a2a2a"],
    isNew: true,
  },
  {
    id: 3,
    name: "Conjunto Deportivo Menta",
    price: 69.99,
    originalPrice: 95.00,
    image: "https://images.unsplash.com/photo-1617724748068-691efeeaf542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBjYXN1YWwlMjB3ZWFyfGVufDF8fHx8MTc2MTAyMDQyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Pantalones",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["#a8d5ba", "#ffffff", "#e5e5e5"],
    isSale: true,
  },
  {
    id: 4,
    name: "Vestido Casual Rosa",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1610170124794-1fce414c7bef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBkcmVzc3xlbnwxfHx8fDE3NjEwMDgxMDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Vestidos",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#f4b8c4", "#ffffff", "#d4c5e2"],
    isNew: true,
  },
  {
    id: 5,
    name: "Accesorios Premium",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYwOTk2MDUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accesorios",
    sizes: ["Único"],
    colors: ["#f5ebe0", "#2a2a2a", "#b8a89a"],
  },
  {
    id: 6,
    name: "Suéter Moderno",
    price: 99.99,
    originalPrice: 140.00,
    image: "https://images.unsplash.com/photo-1608975321561-176c1b187d24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3dlYXRlcnxlbnwxfHx8fDE3NjEwODQ5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Blusas",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#e5e5e5", "#ffffff", "#d4c5e2", "#f5ebe0"],
    isSale: true,
  },
  {
    id: 7,
    name: "Zapatillas Minimalistas",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1722005924485-40c91abb67f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwc2hvZXN8ZW58MXx8fHwxNzYxMDg0OTkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accesorios",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["#ffffff", "#e5e5e5", "#2a2a2a"],
    isNew: true,
  },
  {
    id: 8,
    name: "Blusa Elegante Beige",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1620777888789-0ee95b57a277?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBjbG90aGluZ3xlbnwxfHx8fDE3NjA5Nzk2OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Blusas",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#f5ebe0", "#ffffff", "#d4c5e2"],
  },
  // Productos para Niños
  {
    id: 9,
    name: "Conjunto Infantil Colorido",
    price: 45.99,
    originalPrice: 65.00,
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=80",
    category: "Niños",
    sizes: ["2-3", "4-5", "6-7", "8-9"],
    colors: ["#a8d5ba", "#f4b8c4", "#d4c5e2"],
    isNew: true,
    isSale: true,
  },
  {
    id: 10,
    name: "Vestido Infantil Lavanda",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80",
    category: "Niños",
    sizes: ["2-3", "4-5", "6-7", "8-9", "10-11"],
    colors: ["#d4c5e2", "#f4b8c4", "#ffffff"],
    isNew: true,
  },
  {
    id: 11,
    name: "Pantalón Cómodo Niños",
    price: 35.99,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80",
    category: "Niños",
    sizes: ["2-3", "4-5", "6-7", "8-9", "10-11"],
    colors: ["#2a2a2a", "#e5e5e5", "#a8d5ba"],
  },
  {
    id: 12,
    name: "Sudadera Infantil Suave",
    price: 42.99,
    originalPrice: 60.00,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80",
    category: "Niños",
    sizes: ["2-3", "4-5", "6-7", "8-9"],
    colors: ["#f4b8c4", "#a8d5ba", "#e5e5e5"],
    isSale: true,
  },
  {
    id: 13,
    name: "Conjunto Deportivo Niños",
    price: 48.99,
    image: "https://images.unsplash.com/photo-1514090458221-65cd6449d0ca?w=800&q=80",
    category: "Niños",
    sizes: ["2-3", "4-5", "6-7", "8-9", "10-11"],
    colors: ["#a8d5ba", "#2a2a2a", "#ffffff"],
    isNew: true,
  },
  {
    id: 14,
    name: "Chaqueta Acolchada Niños",
    price: 52.99,
    image: "https://images.unsplash.com/photo-1514090458221-65cd6449d0ca?w=800&q=80",
    category: "Niños",
    sizes: ["4-5", "6-7", "8-9", "10-11"],
    colors: ["#2a2a2a", "#e5e5e5", "#a8d5ba"],
  },
];

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSpringCollectionOpen, setIsSpringCollectionOpen] = useState(false);
  const [isAccessoriesCollectionOpen, setIsAccessoriesCollectionOpen] = useState(false);

  // Mock order for demonstration
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

  // Additional past order for the tracker demo
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

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAddToCart = (product: Product, size?: string) => {
    const selectedSize = size || product.sizes[0];
    const existingItem = cartItems.find(
      (item) => item.id === product.id && item.selectedSize === selectedSize
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1, selectedSize }]);
    }

    toast.success(`${product.name} agregado al carrito`, {
      description: `Talla: ${selectedSize}`,
    });
  };

  // helper used by OrderTracker page to add items by product name
  const handleAddToCartByName = (productName: string) => {
    const found = mockProducts.find((p) => p.name === productName);
    if (found) {
      handleAddToCart(found);
      // open cart drawer so user sees the items
      setIsCartOpen(true);
    } else {
      toast.error(`Producto '${productName}' no encontrado en catálogo`);
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
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
          onOrderTrackingClick={() => setIsOrderTrackerOpen(true)}
          cartItemCount={cartItems.length}
          favoriteCount={favoriteIds.length}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(!darkMode)}
          products={mockProducts}
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
                products={mockProducts}
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
                products={mockProducts}
                selectedCategory={selectedCategory}
                onAddToCart={handleAddToCart}
                onViewDetails={setSelectedProduct}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
              />
            } 
          />
          <Route
            path="/seguimiento"
            element={<OrderTrackerPage orders={ordersForTracker} onAddToCart={handleAddToCartByName} />}
          />
        </Routes>

  {/* Small spacer so page content (product cards) never sit flush against the Footer */}
  <div aria-hidden="true" className="h-12 md:h-20" />
  <Footer onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />

      {/* Modals and drawers */}
      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, size) => handleAddToCart(product, size)}
        isFavorite={selectedProduct ? favoriteIds.includes(selectedProduct.id) : false}
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
        favorites={mockProducts.filter((p) => favoriteIds.includes(p.id))}
        onRemoveFavorite={handleToggleFavorite}
        onViewDetails={setSelectedProduct}
        onAddToCart={(product) => handleAddToCart(product)}
      />

      <CheckoutModal
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        total={total}
      />

      <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <OrderTracker
        open={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orders={ordersForTracker}
      />

      <SizeGuide
        open={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <SpringCollection
        open={isSpringCollectionOpen}
        onClose={() => {
          console.log('Closing Spring Collection Modal');
          setIsSpringCollectionOpen(false);
        }}
        products={mockProducts}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        favoriteIds={favoriteIds}
      />

      <AccessoriesCollection
        open={isAccessoriesCollectionOpen}
        onClose={() => {
          console.log('Closing Accessories Collection Modal');
          setIsAccessoriesCollectionOpen(false);
        }}
        products={mockProducts}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        favoriteIds={favoriteIds}
      />

      {/* WhatsApp Floating Button - Always visible */}
      <WhatsAppButton />
      </div>
    </Router>
  );
}
