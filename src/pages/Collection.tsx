import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Filters } from "../components/Filters";
import { ProductGrid } from "../components/ProductGrid";
import { Product } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../components/ui/sheet";

interface CollectionProps {
  products: Product[];
  selectedCategory: string; // Esta es la pestaña seleccionada (Mujer, Hombre, Todos...)
  onAddToCart: (product: Product, size?: string) => void;
  onViewDetails: (product: Product) => void;
  favoriteIds: (string | number)[];
  onToggleFavorite: (productId: number | string) => void;
  onCategoryChange?: (category: string) => void; // Nueva prop para notificar cambio
}

export function Collection({
  products,
  selectedCategory: propSelectedCategory,
  onAddToCart,
  onViewDetails,
  favoriteIds,
  onToggleFavorite,
  onCategoryChange,
}: CollectionProps) {
  
  const location = useLocation();
  const state = location.state as { selectedCategory?: string } | null;
  
  // Usar la categoría del estado de navegación si existe, sino usar la prop
  const [localCategory, setLocalCategory] = useState(propSelectedCategory);
  
  useEffect(() => {
    // Si venimos con un estado de navegación específico (como desde Hero -> Ofertas)
    if (state?.selectedCategory) {
      setLocalCategory(state.selectedCategory);
      // Notificar al padre (App.tsx) para actualizar el header
      if (onCategoryChange) {
        onCategoryChange(state.selectedCategory);
      }
    } else {
      setLocalCategory(propSelectedCategory);
    }
  }, [state, propSelectedCategory, onCategoryChange]);
  
  const selectedCategory = localCategory;
  
  // Estado local para los filtros de la barra lateral (Izquierda)
  const [filters, setFilters] = useState({
    categories: [] as string[], // Esto filtra por "Tipo de Prenda" (Blusas, Vestidos...)
    sizes: [] as string[],
    colors: [] as string[],
    priceRange: [0, 500] as [number, number],
  });
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // --- LÓGICA DE FILTRADO MAESTRA ---
  const filteredProducts = products.filter((product) => {
    
    // 1. FILTRO POR PESTAÑA PRINCIPAL (Header: Mujer, Hombre, Niños...)
    // ----------------------------------------
    let mainTabMatch = false;

    if (selectedCategory === "Todos") {
      mainTabMatch = true;
    } else if (selectedCategory === "Ofertas") {
      // Si la pestaña es Ofertas, buscamos productos con descuento
      mainTabMatch = !!product.isSale;
    } else {
      // AQUÍ ESTÁ LA CORRECCIÓN:
      // Comparamos la pestaña seleccionada con el GÉNERO del producto.
      // Si estoy en la pestaña "Mujer", busco productos donde gender sea "Mujer".
      // Usamos el operador ?. por si el producto antiguo no tiene género definido.
      mainTabMatch = product.gender === selectedCategory;
    }

    // Si no coincide con la pestaña principal, lo descartamos inmediatamente
    if (!mainTabMatch) return false;


    // 2. FILTROS LATERALES (Sidebar: Tipo, Talla, Color...)
    // ------------------------------
    
    // A. Categorías (Tipo de prenda: Vestidos, Pantalones...)
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // B. Tallas (Tiene alguna de las tallas seleccionadas?)
    if (filters.sizes.length > 0) {
      const hasSize = product.sizes.some((size) => filters.sizes.includes(size));
      if (!hasSize) return false;
    }

    // C. Colores (Tiene alguno de los colores seleccionados?)
    if (filters.colors.length > 0) {
      const hasColor = product.colors.some((color) => filters.colors.includes(color));
      if (!hasColor) return false;
    }

    // D. Precio (Rango) - Usamos el precio REAL (Si tiene oferta, usa ese)
    const effectivePrice = product.discountPrice || product.price;
    if (effectivePrice < filters.priceRange[0] || effectivePrice > filters.priceRange[1]) {
      return false;
    }

    return true;
  });

  return (
    <main
      id="products-section"
      className="container mx-auto px-4 pb-40 md:pb-48 flex-1 w-full min-h-[calc(100vh-200px)]"
      style={{ paddingTop: "calc(var(--header-offset, 0px) + 1rem)" }}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Filters filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Grilla de Productos */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2 text-2xl font-bold">
                {selectedCategory === "Todos" ? "Nuestra Colección" : selectedCategory}
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} productos encontrados
              </p>
            </div>

            {/* Botón Filtros Móvil */}
            <Button 
              variant="outline" 
              className="lg:hidden rounded-full"
              onClick={() => setIsFiltersOpen(true)}
            >
              Filtros
            </Button>
          </div>

          {filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              onAddToCart={(product) => onAddToCart(product)}
              onViewDetails={onViewDetails}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
            />
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
              <p className="text-xl text-gray-500 font-medium">No se encontraron productos.</p>
              <p className="text-sm text-gray-400 mt-2">Intenta cambiar de pestaña o limpiar los filtros laterales.</p>
              <Button 
                variant="link" 
                onClick={() => setFilters({ categories: [], sizes: [], colors: [], priceRange: [0, 500] })}
                className="mt-4"
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Filtros Móvil */}
      <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <SheetContent side="left" className="w-full sm:w-80 overflow-y-auto p-0 flex flex-col bg-white">
          <SheetHeader className="px-6 pt-6 pb-2 flex-shrink-0">
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription className="sr-only">
              Filtra productos por categorías, tallas, colores y precio
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <Filters filters={filters} onFilterChange={setFilters} />
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}