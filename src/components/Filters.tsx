import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";

interface FiltersProps {
  filters: {
    categories: string[];
    sizes: string[];
    colors: string[];
    priceRange: [number, number];
  };
  onFilterChange: (filters: any) => void;
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  const categories = ["Vestidos", "Blusas", "Pantalones", "Faldas", "Chaquetas", "Accesorios"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Beige", value: "#f5ebe0" },
    { name: "Lavanda", value: "#d4c5e2" },
    { name: "Menta", value: "#a8d5ba" },
    { name: "Rosa", value: "#f4b8c4" },
    { name: "Gris", value: "#e5e5e5" },
    { name: "Negro", value: "#2a2a2a" },
    { name: "Blanco", value: "#ffffff" },
  ];

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleSizeChange = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleColorChange = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  return (
    <aside className="w-full lg:w-64 bg-background dark:bg-[#1a1a1a] lg:rounded-2xl px-6 pt-2 pb-6 lg:p-6 lg:border lg:border-border h-fit lg:sticky lg:top-24 lg:shadow-sm">
      <h3 className="mb-4 text-foreground hidden lg:block">Filtros</h3>
      
      <Separator className="my-4 hidden lg:block" />
      
      {/* Categories */}
      <div className="mb-6">
        <h4 className="mb-3 text-foreground">Categorías</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="cursor-pointer text-foreground"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Sizes */}
      <div className="mb-6">
        <h4 className="mb-3 text-foreground">Tallas</h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`py-2 px-3 rounded-lg border transition-all ${
                filters.sizes.includes(size)
                  ? "bg-[#b8a89a] text-white border-[#b8a89a]"
                  : "border-border hover:border-[#b8a89a] text-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Colors */}
      <div className="mb-6">
        <h4 className="mb-3 text-foreground">Colores</h4>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorChange(color.name)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                filters.colors.includes(color.name)
                  ? "border-[#b8a89a] scale-110 ring-2 ring-[#b8a89a] ring-offset-2 dark:ring-offset-[#121212]"
                  : "border-border hover:scale-105"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="mb-3 text-foreground">Precio</h4>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => onFilterChange({ ...filters, priceRange: value as [number, number] })}
            max={500}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-muted-foreground dark:text-[#CCCCCC]">
            <span>S/ {filters.priceRange[0]}</span>
            <span>S/ {filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() =>
          onFilterChange({
            categories: [],
            sizes: [],
            colors: [],
            priceRange: [0, 500] as [number, number],
          })
        }
        className="w-full py-2 text-center text-muted-foreground hover:text-foreground transition-colors mb-0"
      >
        Limpiar filtros
      </button>
    </aside>
  );
}
