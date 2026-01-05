import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Plus, X, Trash2, Box, RefreshCw, ArrowRight, Pencil, Image as ImageIcon, LogOut } from 'lucide-react';
import { toast } from 'sonner';

// --- FUNCIÓN AUXILIAR PARA HEADERS CON AUTENTICACIÓN ---
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Authorization': `Bearer ${token}`
  };
};

// --- TIPOS ---
interface Category {
  id: string;
  name: string;
}

interface Variant {
  size: string;
  color: string;
  stock: string;
}

interface ProductList {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  discountPrice?: number;
  isActive: boolean;
  isNewArrival: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  materialInfo: string;
  shippingInfo: string;
  categoryId: string;
  gender: string; 
  images: { url: string }[];
  variants: { stock: number; size: string; color: string }[];
  category: { name: string };
}

// --- COMPONENTE 1: LISTA DE PRODUCTOS (CON BOTÓN EDITAR) ---
function ProductListManager({ onEdit }: { onEdit: (product: ProductList) => void }) {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/products/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (res.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        localStorage.clear();
        window.location.href = '/admin/login';
        return;
      }
      
      fetchProducts();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  useEffect(() => { 
    fetchProducts(); 
    
    // Auto-refresh cada 30 segundos para mantener el stock actualizado
    const interval = setInterval(() => {
      fetchProducts();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando inventario...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Inventario Actual</h3>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} productos en total
            <span className="ml-2 text-xs text-indigo-600">• Auto-actualización cada 30s</span>
          </p>
        </div>
        <button 
          onClick={fetchProducts} 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors border border-indigo-200 font-medium shadow-sm"
        >
          <RefreshCw className="w-4 h-4"/>
          Actualizar
        </button>
      </div>

      <div className="grid gap-4">
        {products.map((p) => {
          const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
          const uniqueColors = Array.from(new Set(p.variants.map(v => v.color)));

          return (
            <div key={p.id} className="group bg-white border-2 border-gray-100 hover:border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center transition-all hover:shadow-lg">
              {/* Imagen */}
              <div className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200 shadow-sm">
                {p.images[0] ? (
                    <img src={p.images[0].url} loading="lazy" className="w-full h-full object-cover" alt={p.name} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <ImageIcon className="w-8 h-8"/>
                    </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-900 text-lg">{p.name}</h4>
                  {!p.isActive && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-semibold">
                      Oculto
                    </span>
                  )}
                  <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                    {p.gender}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <Box className="w-4 h-4" />
                    {p.category?.name}
                  </span>
                  <span className="font-semibold text-gray-900">
                    Stock: {totalStock}
                  </span>
                </div>
                
                <div className="flex gap-2 items-center">
                  {p.discountPrice ? (
                    <>
                      <span className="line-through text-gray-400 text-sm">S/ {p.basePrice}</span>
                      <span className="font-bold text-red-600 text-lg">S/ {p.discountPrice}</span>
                      <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full font-bold">
                        OFERTA
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-gray-900 text-lg">S/ {p.basePrice}</span>
                  )}
                </div>

                {/* Bolitas de color */}
                <div className="flex gap-2 mt-3">
                  {uniqueColors.map((color, i) => {
                      const variantsOfColor = p.variants.filter(v => v.color === color);
                      const summary = variantsOfColor.map(v => `${v.size}: ${v.stock}`).join("\n");
                      return (
                        <div 
                          key={i} 
                          className="group/color relative w-8 h-8 rounded-full border-2 border-white shadow-md cursor-help hover:scale-110 transition-transform" 
                          style={{ backgroundColor: color }}
                          title={summary}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover/color:opacity-100 whitespace-pre pointer-events-none z-10 transition-opacity shadow-xl">
                            {summary}
                          </div>
                        </div>
                      );
                  })}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => onEdit(p)} 
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 text-indigo-600 hover:bg-blue-100 border border-indigo-200 transition-all font-medium shadow-sm hover:shadow"
                >
                  <Pencil className="w-4 h-4" />
                  <span className="sm:hidden">Editar</span>
                </button>
                <button 
                  onClick={() => deleteProduct(p.id)} 
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all font-medium shadow-sm hover:shadow"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sm:hidden">Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- COMPONENTE 2: FORMULARIO DE PRODUCTO (CREAR Y EDITAR) ---
interface ProductFormProps {
    categories: Category[];
    onSuccess: () => void;
    initialData?: ProductList | null; // Datos para editar
    onCancel: () => void; // Cancelar edición
}

function ProductForm({ categories, onSuccess, initialData, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Estados de variantes
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sizeStocks, setSizeStocks] = useState<Record<string, string>>({}); 
  
  // Tallas disponibles (BD)
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [loadingSizes, setLoadingSizes] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    discountPrice: '',
    categoryId: '',
    gender: 'Unisex', // Valor por defecto
    isTrending: false,
    isNewArrival: true,
    isFeatured: false,
    isActive: true,
    materialInfo: '',
    shippingInfo: '',
  });

  // --- EFECTO: CARGAR DATOS SI ESTAMOS EDITANDO ---
  useEffect(() => {
    if (initialData) {
        setFormData({
            name: initialData.name,
            description: initialData.description || '',
            basePrice: String(initialData.basePrice),
            discountPrice: initialData.discountPrice ? String(initialData.discountPrice) : '',
            categoryId: initialData.categoryId,
            gender: initialData.gender || 'Unisex',
            isTrending: initialData.isTrending,
            isNewArrival: initialData.isNewArrival,
            isFeatured: initialData.isFeatured,
            isActive: initialData.isActive,
            materialInfo: initialData.materialInfo || '',
            shippingInfo: initialData.shippingInfo || '',
        });
        
        // Cargar variantes existentes a la tabla
        const mappedVariants = initialData.variants.map(v => ({
            color: v.color,
            size: v.size,
            stock: String(v.stock)
        }));
        setVariants(mappedVariants);
    }
  }, [initialData]);

  // Cargar tallas globales
  useEffect(() => {
    setLoadingSizes(true);
    fetch('http://localhost:4000/api/sizes')
      .then(res => res.json())
      .then((data: any[]) => {
        const validSizes = data.map(s => s.value).filter(Boolean);
        setAvailableSizes(validSizes);
        setLoadingSizes(false);
      })
      .catch(() => setLoadingSizes(false));
  }, []);

  const handleAddCustomSize = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation(); // Detener propagación
      const val = customSizeInput.trim().toUpperCase();
      if (!val) return;

      if (!availableSizes.includes(val)) setAvailableSizes(prev => [...prev, val]);
      if (!selectedSizes.includes(val)) {
          setSelectedSizes(prev => [...prev, val]);
          setSizeStocks(prev => ({ ...prev, [val]: '0' }));
      }
      setCustomSizeInput(''); 

      try {
        const res = await fetch('http://localhost:4000/api/sizes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ value: val })
        });
        
        if (res.status === 401) {
          toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          localStorage.clear();
          window.location.href = '/admin/login';
          return;
        }
      } catch (error) { console.error(error); }
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCheckbox = (c: boolean | string, f: string) => setFormData({ ...formData, [f]: !!c } as any);

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
        setSelectedSizes(selectedSizes.filter(s => s !== size));
        const newStocks = { ...sizeStocks };
        delete newStocks[size];
        setSizeStocks(newStocks);
    } else {
        setSelectedSizes([...selectedSizes, size]);
        if (!sizeStocks[size]) setSizeStocks(prev => ({ ...prev, [size]: '0' }));
    }
  };

  const handleStockChange = (size: string, value: string) => {
      setSizeStocks(prev => ({ ...prev, [size]: value }));
  };

  const addBulkVariants = () => {
    if (selectedSizes.length === 0) return alert("Selecciona al menos una talla");

    const newVariants = selectedSizes.map(size => ({
        color: selectedColor,
        size: size,
        stock: sizeStocks[size] || '0' 
    }));

    setVariants(prev => {
        const filteredPrev = prev.filter(p => 
            !newVariants.some(n => n.color === p.color && n.size === p.size)
        );
        return [...filteredPrev, ...newVariants];
    });

    setSelectedSizes([]);
    setSizeStocks({});
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (variants.length === 0) return alert("Agrega al menos una variante");
    
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, String((formData as any)[key])));
      if (file) data.append('imageFile', file);
      data.append('variants', JSON.stringify(variants));

      // Lógica dinámica: Si hay initialData usamos PUT (Editar), si no POST (Crear)
      const url = initialData 
        ? `http://localhost:4000/api/products/${initialData.id}`
        : 'http://localhost:4000/api/products';
      
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, { 
        method, 
        body: data,
        headers: getAuthHeaders()
      });
      
      if (res.status === 401) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        localStorage.clear();
        window.location.href = '/admin/login';
        return;
      }

      if (res.ok) {
        alert(initialData ? '✅ Producto actualizado correctamente' : '✅ Producto creado correctamente');
        onSuccess();
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 relative">
      
      {/* Banner de Edición */}
      {initialData && (
          <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
              <div className="text-indigo-800 font-bold flex items-center gap-2">
                  <Pencil className="w-5 h-5"/> 
                  <span>EDITANDO: <span className="text-indigo-600">{initialData.name}</span></span>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-white text-indigo-600 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors font-medium shadow-sm"
              >
                Cancelar Edición
              </button>
          </div>
      )}

      {/* Título */}
      {!initialData && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Producto</h2>
          <p className="text-sm text-gray-500 mt-1">Completa la información del producto</p>
        </div>
      )}

      {/* 1. Visibilidad */}
      <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-400'} transition-all`}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                {formData.isActive ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                )}
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Visibilidad del Producto</h3>
              <p className="text-sm text-gray-600">
                {formData.isActive ? "Visible en la tienda" : "Oculto para los clientes"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-bold text-base ${formData.isActive ? "text-emerald-600" : "text-gray-500"}`}>
              {formData.isActive ? "VISIBLE" : "OCULTO"}
            </span>
            <Checkbox 
              checked={formData.isActive} 
              onCheckedChange={(c) => handleCheckbox(c as boolean, 'isActive')}
              className="w-7 h-7"
            />
          </div>
        </div>
      </div>

      {/* 2. Datos Principales */}
      <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 space-y-8">
        <h3 className="font-bold text-xl text-gray-900 flex items-center gap-3 pb-3 border-b-2 border-gray-100">
          <Box className="w-6 h-6 text-indigo-600" />
          Información Básica
        </h3>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-3">
            <Label className="text-gray-800 font-semibold text-base">Nombre del Producto *</Label>
            <Input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="Ej: Vestido Atun"
              className="border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-14 text-base px-4"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
                <Label className="text-gray-800 font-semibold text-base">Precio Base (S/.) *</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  name="basePrice" 
                  value={formData.basePrice} 
                  onChange={handleChange} 
                  required 
                  placeholder="0.00"
                  className="border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-14 text-base px-4"
                />
            </div>
            <div className="space-y-3">
                <Label className="text-red-600 font-semibold text-base flex items-center gap-2">
                  Precio con Oferta (Opcional)
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">DESCUENTO</span>
                </Label>
                <Input 
                  type="number" 
                  step="0.01"
                  name="discountPrice" 
                  value={formData.discountPrice} 
                  onChange={handleChange} 
                  placeholder="0.00" 
                  className="border-2 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 h-14 text-base px-4"
                />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* SECCIÓN / GÉNERO */}
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 space-y-3">
            <Label className="text-gray-800 font-semibold text-base">Sección / Género *</Label>
            <select 
                name="gender" 
                className="flex h-14 w-full rounded-xl border-2 border-gray-300 bg-white px-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium text-gray-700 text-base"
                value={formData.gender} 
                onChange={handleChange}
            >
                <option value="Mujer">👗 Mujer</option>
                <option value="Hombre">👔 Hombre</option>
                <option value="Niños">👶 Niños</option>
                <option value="Accesorios">👜 Accesorios</option>
                <option value="Unisex">🌈 Unisex</option>
            </select>
        </div>

        {/* CATEGORÍA / TIPO DE PRENDA */}
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 space-y-3">
            <Label className="text-gray-800 font-semibold text-base">Tipo de Prenda (Categoría) *</Label>
            <select 
              name="categoryId" 
              className="flex h-14 w-full rounded-xl border-2 border-gray-300 bg-white px-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium text-gray-700 text-base" 
              value={formData.categoryId} 
              onChange={handleChange} 
              required
            >
              <option value="">Seleccionar...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>
      </div>

      {/* Imagen Principal */}
      <div className="bg-purple-50 p-8 rounded-2xl border-2 border-purple-200 space-y-5">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-purple-600" />
          <Label className="text-gray-900 font-bold text-xl">Imagen Principal del Producto</Label>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Previsualización imagen actual si estamos editando */}
          {initialData && initialData.images[0] && !file && (
            <div className="relative group w-24 h-24 flex-shrink-0">
              <img src={initialData.images[0].url} loading="lazy" className="w-full h-full object-cover rounded-xl border-2 border-gray-200" alt="Imagen actual" />
              <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold">Actual</span>
              </div>
            </div>
          )}
          
          {file && (
            <div className="relative group w-24 h-24 flex-shrink-0">
              <img src={URL.createObjectURL(file)} loading="lazy" className="w-full h-full object-cover rounded-xl border-2 border-purple-300" alt="Nueva imagen" />
              <div className="absolute inset-0 bg-purple-600/70 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold">Nueva</span>
              </div>
            </div>
          )}
          
          <div className="flex-1 space-y-3">
            <Input 
              type="file" 
              onChange={(e) => e.target.files && setFile(e.target.files[0])} 
              accept="image/*" 
              required={!initialData}
              className="border-2 border-purple-300 focus:border-purple-500 h-14 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-purple-600 file:text-white file:font-semibold hover:file:bg-purple-700 cursor-pointer text-base"
            />
            <p className="text-sm text-gray-700 font-medium bg-white/60 p-3 rounded-lg">
              {initialData 
                ? "💡 Sube una nueva imagen solo si quieres cambiar la actual"
                : "📸 Formatos aceptados: JPG, PNG, WEBP (Max: 5MB)"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. GESTOR DE INVENTARIO */}
      <div className="border-2 border-indigo-200 bg-indigo-50 p-8 rounded-2xl space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-200">
            <Box className="w-6 h-6 text-indigo-600"/>
            <h3 className="font-bold text-xl text-indigo-900">Variantes e Inventario</h3>
        </div>
        
        <div className="grid md:grid-cols-12 gap-8">
            {/* Panel Izquierdo: Generador */}
            <div className="md:col-span-6 space-y-6 h-fit">
                <div className="space-y-3">
                    <Label className="block font-bold text-gray-800 text-base">1. Color</Label>
                    <div className="flex items-center gap-4">
                        <Input type="color" className="w-16 h-16 p-2 cursor-pointer rounded-xl border-2 border-gray-300" value={selectedColor} onChange={e => setSelectedColor(e.target.value)} />
                        <span className="text-sm font-mono bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-700">{selectedColor}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="block font-bold text-gray-800 text-base">2. Tallas</Label>
                        {loadingSizes && <span className="text-xs text-gray-500 animate-pulse font-semibold">Cargando...</span>}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {availableSizes.map(size => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`px-4 py-2.5 text-sm font-bold rounded-xl border-2 transition-all shadow-sm hover:shadow-md ${
                                    selectedSizes.includes(size) 
                                        ? 'bg-indigo-600 text-white border-indigo-700' 
                                        : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
                                }`}
                                style={selectedSizes.includes(size) ? { backgroundColor: '#4F46E5', color: '#FFFFFF' } : {}}
                            >
                                {size || "?"}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3 items-center bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                        <Input 
                            placeholder="Agregar nueva talla (Ej: 44)..." 
                            className="h-12 text-base border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" 
                            value={customSizeInput} 
                            onChange={(e) => setCustomSizeInput(e.target.value)} 
                            onKeyDown={handleAddCustomSize} 
                        />
                        <span className="text-xs text-gray-500 font-bold uppercase whitespace-nowrap">Presiona Enter</span>
                    </div>
                </div>

                {selectedSizes.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-3">
                        <Label className="block font-bold text-gray-800 text-base">3. Stock por Talla</Label>
                        <div className="bg-gray-100 p-5 rounded-xl border-2 border-gray-300 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {selectedSizes.map(size => (
                                <div key={size} className="flex flex-col gap-2 bg-white p-3 rounded-lg border-2 border-gray-200 shadow-sm">
                                    <span className="text-sm font-bold text-gray-700 uppercase text-center">{size}</span>
                                    <Input 
                                        type="number" 
                                        className="h-12 text-center text-base font-semibold border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" 
                                        placeholder="0" 
                                        value={sizeStocks[size] || ''} 
                                        onChange={(e) => handleStockChange(size, e.target.value)} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button 
                    type="button" 
                    onClick={addBulkVariants} 
                    disabled={selectedSizes.length === 0}
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
                    style={{ backgroundColor: selectedSizes.length === 0 ? '#9CA3AF' : '#4F46E5', color: '#FFFFFF' }}
                >
                    <ArrowRight className="w-5 h-5"/> Agregar Variantes
                </button>
            </div>

            {/* Panel Derecho: Lista Actual */}
            <div className="md:col-span-6 overflow-hidden flex flex-col max-h-[600px]">
                <div className="bg-indigo-100 p-5 font-bold text-base border-b-2 border-indigo-200 flex justify-between items-center rounded-t-2xl">
                    <span className="text-gray-800">Lista Actual</span>
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">{variants.length}</span>
                </div>
                <div className="overflow-y-auto p-2 flex-1 bg-white rounded-b-2xl">
                    {variants.length > 0 ? (
                        <table className="w-full text-base">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 text-left font-bold text-gray-700">Color</th>
                                    <th className="p-4 text-left font-bold text-gray-700">Talla</th>
                                    <th className="p-4 text-left font-bold text-gray-700">Stock</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((v, i) => (
                                    <tr key={i} className="border-t border-gray-200 hover:bg-indigo-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm" style={{backgroundColor: v.color}}></div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">{v.size}</td>
                                        <td className="p-4">
                                            <input 
                                                type="number" 
                                                className="w-20 h-10 border-2 border-gray-300 rounded-lg px-2 text-center font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" 
                                                value={v.stock} 
                                                onChange={(e) => { const n = [...variants]; n[i].stock = e.target.value; setVariants(n); }} 
                                            />
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                type="button" 
                                                onClick={() => removeVariant(i)} 
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                                            >
                                                <X className="w-5 h-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="h-full flex items-center justify-center p-12">
                            <p className="text-gray-400 text-base font-medium">Sin variantes agregadas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Descripciones y Detalles */}
      <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 space-y-8">
        <h3 className="font-bold text-xl text-gray-900 flex items-center gap-3 pb-3 border-b-2 border-gray-100">
          <Box className="w-6 h-6 text-indigo-600" />
          Descripciones y Detalles
        </h3>
        
        <div className="space-y-3">
          <Label className="text-gray-800 font-semibold text-base">Descripción del Producto</Label>
          <Textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Describe las características principales del producto..."
            className="min-h-[120px] border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base p-4 resize-none"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-gray-800 font-semibold text-base">Materiales y Composición</Label>
              <Textarea 
                name="materialInfo" 
                value={formData.materialInfo} 
                onChange={handleChange} 
                placeholder="Ej: 100% algodón, poliéster..."
                className="h-32 border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base p-4 resize-none"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-gray-800 font-semibold text-base">Información de Envíos</Label>
              <Textarea 
                name="shippingInfo" 
                value={formData.shippingInfo} 
                onChange={handleChange} 
                placeholder="Ej: Envío en 24-48 horas..."
                className="h-32 border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base p-4 resize-none"
              />
            </div>
        </div>
      </div>

      {/* Etiquetas de Marketing */}
      <div className="bg-amber-50 p-8 rounded-2xl border-2 border-amber-200">
        <Label className="text-gray-900 font-bold text-xl mb-6 block flex items-center gap-3">
          ⭐ Etiquetas de Marketing
        </Label>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border-2 border-gray-200 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md">
            <Checkbox checked={formData.isNewArrival} onCheckedChange={c => handleCheckbox(c as boolean, 'isNewArrival')} className="w-6 h-6" />
            <span className="font-semibold text-gray-700 text-base">✨ Nuevo Arribo</span>
          </label>
          <label className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border-2 border-gray-200 cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all shadow-sm hover:shadow-md">
            <Checkbox checked={formData.isTrending} onCheckedChange={c => handleCheckbox(c as boolean, 'isTrending')} className="w-6 h-6" />
            <span className="font-semibold text-gray-700 text-base">🔥 En Tendencia</span>
          </label>
          <label className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border-2 border-gray-200 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all shadow-sm hover:shadow-md">
            <Checkbox checked={formData.isFeatured} onCheckedChange={c => handleCheckbox(c as boolean, 'isFeatured')} className="w-6 h-6" />
            <span className="font-semibold text-gray-700 text-base">⭐ Destacado</span>
          </label>
        </div>
      </div>

      {/* Botón de Envío */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full h-20 bg-indigo-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-indigo-300 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4"
        style={{ backgroundColor: loading ? '#4F46E5' : '#4F46E5', color: '#FFFFFF' }}
      >
        {loading ? (
          <>
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="text-lg">Guardando producto...</span>
          </>
        ) : (
          <>
            <ArrowRight className="w-6 h-6" />
            <span>{initialData ? '✅ ACTUALIZAR PRODUCTO' : '✨ CREAR PRODUCTO'}</span>
          </>
        )}
      </button>
    </form>
  );
}

// --- COMPONENTE 3: GESTOR DE CATEGORÍAS (CON ELIMINAR) ---
function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = () => {
    fetch('http://localhost:4000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ name, description }),
      });
      
      if (res.status === 401) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        localStorage.clear();
        window.location.href = '/admin/login';
        return;
      }
      setName('');
      fetchCategories();
      alert('Categoría creada');
    } catch (error) {
      alert('Error creando');
    } finally {
      setLoading(false);
    }
  };

  // NUEVA FUNCIÓN PARA ELIMINAR
  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres borrar esta categoría?')) return;
    
    try {
      const res = await fetch(`http://localhost:4000/api/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (res.status === 401) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        localStorage.clear();
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        fetchCategories();
      } else {
        alert('Error al borrar. Verifique que no esté en uso.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  };

  return (
    <div className="space-y-8">
      {/* Título */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h2>
        <p className="text-sm text-gray-500 mt-1">Organiza tus productos por categorías</p>
      </div>

      {/* Formulario de Nueva Categoría */}
      <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100">
        <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-600" />
          Crear Nueva Categoría
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category-name" className="text-gray-700 font-medium mb-2 block">Nombre de la Categoría</Label>
            <Input
              id="category-name"
              placeholder="Ej: Pantalones, Blusas..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            style={{ backgroundColor: (loading || !name.trim()) ? '#9CA3AF' : '#4F46E5', color: '#FFFFFF' }}
          >
            {loading ? 'Creando...' : '✨ Crear Categoría'}
          </button>
        </form>
      </div>

      {/* Lista de Categorías Existentes */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
        <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Box className="w-5 h-5 text-gray-700" />
            Categorías Existentes
          </span>
          <span className="text-sm font-normal bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'}
          </span>
        </h3>
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Box className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 italic">No hay categorías creadas todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((c) => (
              <div 
                key={c.id} 
                className="group relative flex items-center justify-between bg-gray-50 hover:bg-indigo-50 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-all"
              >
                <span className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                  {c.name}
                </span>
                <button 
                  onClick={() => handleDelete(c.id)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 hover:bg-red-200 hover:text-red-700 transition-all"
                  title="Eliminar categoría"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- ADMIN PRINCIPAL ---
export default function AdminManager() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'categories'>('list');
  const [categories, setCategories] = useState<Category[]>([]);
  
  // ESTADO PARA EDICIÓN
  const [productToEdit, setProductToEdit] = useState<ProductList | null>(null);

  const fetchCategories = () => {
    fetch('http://localhost:4000/api/categories').then(r => r.json()).then(setCategories);
  };

  useEffect(() => { fetchCategories(); }, []);

  // Manejar click en "Editar" desde la lista
  const handleEditClick = (product: ProductList) => {
      setProductToEdit(product);
      setActiveTab('create'); // Cambiamos a la pestaña del formulario
  };

  // Manejar fin de edición (guardado o cancelado)
  const handleEditComplete = () => {
      setProductToEdit(null); // Limpiamos edición
      setActiveTab('list');   // Volvemos a la lista
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminAuthenticated');
    toast.success('Sesión cerrada correctamente');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Superior */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-500">Gestión de tienda</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-200 font-medium shadow-sm hover:shadow"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar de Navegación */}
          <aside className="lg:col-span-3 space-y-3">
            <nav className="bg-white rounded-2xl shadow-md border border-gray-200 p-2 space-y-1">
              <button 
                onClick={() => { setActiveTab('list'); setProductToEdit(null); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${
                  activeTab === 'list' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                }`}
                style={activeTab === 'list' ? { backgroundColor: '#4F46E5', color: '#FFFFFF' } : {}}
              >
                <Box className="w-5 h-5" />
                <span>Lista de Productos</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('create'); setProductToEdit(null); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${
                  activeTab === 'create' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                }`}
                style={activeTab === 'create' ? { backgroundColor: '#4F46E5', color: '#FFFFFF' } : {}}
              >
                <Plus className="w-5 h-5" />
                <span>Crear Producto</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('categories'); setProductToEdit(null); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${
                  activeTab === 'categories' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                }`}
                style={activeTab === 'categories' ? { backgroundColor: '#4F46E5', color: '#FFFFFF' } : {}}
              >
                <Box className="w-5 h-5" />
                <span>Categorías</span>
              </button>
            </nav>
          </aside>

          {/* Contenido Principal */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8 min-h-[600px]">
              {activeTab === 'list' && <ProductListManager onEdit={handleEditClick} />}
              
              {activeTab === 'create' && (
                 categories.length > 0 
                 ? <ProductForm 
                      categories={categories} 
                      onSuccess={handleEditComplete} 
                      initialData={productToEdit} 
                      onCancel={handleEditComplete}
                   />
                 : <div className="flex flex-col items-center justify-center p-10 text-center">
                     <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                       <Box className="w-8 h-8 text-amber-600" />
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías</h3>
                     <p className="text-gray-500 mb-4">Crea categorías primero en la pestaña Categorías para poder agregar productos.</p>
                     <button 
                       onClick={() => setActiveTab('categories')}
                       className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                     >
                       Ir a Categorías
                     </button>
                   </div>
              )}

              {activeTab === 'categories' && <CategoryManager />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}