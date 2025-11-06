import { useState } from "react";
import { Filters } from "../components/Filters";
import { ProductGrid } from "../components/ProductGrid";
import { Product } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../components/ui/sheet";

interface CollectionProps {
  products: Product[];
  selectedCategory: string;
  onAddToCart: (product: Product, size?: string) => void;
  onViewDetails: (product: Product) => void;
  favoriteIds: number[];
  onToggleFavorite: (productId: number) => void;
}

export function Collection({
  products,
  selectedCategory,
  onAddToCart,
  onViewDetails,
  favoriteIds,
  onToggleFavorite,
}: CollectionProps) {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    priceRange: [0, 500] as [number, number],
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filter products based on category and filters
  const filteredProducts = products.filter((product) => {
    // Category filter
    const categoryMatch =
      selectedCategory === "Todos" ||
      (selectedCategory === "Ofertas" && product.isSale) ||
      (selectedCategory === "Mujer" && ["Vestidos", "Blusas", "Chaquetas"].includes(product.category)) ||
      (selectedCategory === "Hombre" && ["Pantalones"].includes(product.category)) ||
      (selectedCategory === "Niños" && product.category === "Niños") ||
      (selectedCategory === "Accesorios" && product.category === "Accesorios");

    if (!categoryMatch) return false;

    // Filters
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    if (filters.sizes.length > 0 && !product.sizes.some((size) => filters.sizes.includes(size))) {
      return false;
    }

    if (filters.colors.length > 0 && !product.colors.some((color) => filters.colors.includes(color))) {
      return false;
    }

    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
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
        {/* Filters sidebar - Desktop */}
        <div className="hidden lg:block">
          <Filters filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Products grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Nuestra Colección</h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} productos encontrados
              </p>
            </div>

            {/* Mobile filters button */}
            <Button 
              variant="outline" 
              className="lg:hidden rounded-full"
              onClick={() => setIsFiltersOpen(true)}
            >
              Filtros
            </Button>
          </div>

          <ProductGrid
            products={filteredProducts}
            onAddToCart={(product) => onAddToCart(product)}
            onViewDetails={onViewDetails}
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <SheetContent side="left" className="w-full sm:w-80 overflow-y-auto p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-2 flex-shrink-0">
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription className="sr-only">
              Filtra productos por categorías, tallas, colores y precio
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <Filters filters={filters} onFilterChange={setFilters} />
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
