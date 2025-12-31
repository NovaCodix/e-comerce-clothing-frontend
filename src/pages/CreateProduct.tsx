import { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Plus, X, Trash2, Box, RefreshCw, ArrowRight, Pencil, Image as ImageIcon } from 'lucide-react';

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
      await fetch(`http://localhost:4000/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando inventario...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Inventario Actual ({products.length})</h3>
        <Button variant="outline" onClick={fetchProducts} size="sm"><RefreshCw className="w-4 h-4 mr-2"/> Actualizar</Button>
      </div>

      <div className="grid gap-4">
        {products.map((p) => {
          const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
          const uniqueColors = Array.from(new Set(p.variants.map(v => v.color)));

          return (
            <div key={p.id} className="bg-white p-4 rounded-xl border flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
              {/* Imagen */}
              <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 border">
                {p.images[0] ? (
                    <img src={p.images[0].url} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon className="w-6 h-6"/></div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-800">{p.name}</h4>
                  {!p.isActive && <span className="text-xs bg-red-100 text-red-600 px-2 rounded font-medium">Oculto</span>}
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 rounded">{p.gender}</span>
                </div>
                <p className="text-sm text-gray-500">{p.category?.name} • Stock Total: <span className="font-medium text-black">{totalStock}</span></p>
                
                <div className="flex gap-2 text-sm mt-1">
                  {p.discountPrice ? (
                    <>
                      <span className="line-through text-gray-400">S/ {p.basePrice}</span>
                      <span className="font-bold text-red-500">S/ {p.discountPrice}</span>
                    </>
                  ) : (
                    <span className="font-bold">S/ {p.basePrice}</span>
                  )}
                </div>

                {/* Bolitas de color */}
                <div className="flex gap-1 mt-2">
                  {uniqueColors.map((color, i) => {
                      const variantsOfColor = p.variants.filter(v => v.color === color);
                      const summary = variantsOfColor.map(v => `${v.size}: ${v.stock}`).join("\n");
                      return (
                        <div key={i} className="w-6 h-6 rounded-full border border-gray-200 shadow-sm cursor-help relative group" style={{ backgroundColor: color }}>
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-pre pointer-events-none z-10 transition-opacity shadow-xl">
                                {summary}
                            </div>
                        </div>
                      );
                  })}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(p)} className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => deleteProduct(p.id)} className="h-8 w-8">
                  <Trash2 className="w-4 h-4" />
                </Button>
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
        await fetch('http://localhost:4000/api/sizes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: val })
        });
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

      const res = await fetch(url, { method, body: data });

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
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 relative">
      
      {/* Banner de Edición */}
      {initialData && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex justify-between items-center mb-6">
              <div className="text-blue-800 font-bold flex items-center gap-2">
                  <Pencil className="w-5 h-5"/> EDITANDO: {initialData.name}
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="text-blue-600 hover:bg-blue-100">
                  Cancelar Edición
              </Button>
          </div>
      )}

      {/* 1. Visibilidad */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-700">Visibilidad</h3>
        <div className="flex items-center gap-2">
            <Label className={formData.isActive ? "text-green-600 font-bold" : "text-gray-500"}>
                {formData.isActive ? "VISIBLE" : "OCULTO"}
            </Label>
            <Checkbox checked={formData.isActive} onCheckedChange={(c) => handleCheckbox(c as boolean, 'isActive')} />
        </div>
      </div>

      {/* 2. Datos Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Nombre del Producto</Label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Precio Base (S/.)</Label>
                <Input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label className="text-red-500">Oferta (Opcional)</Label>
                <Input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} placeholder="0.00" />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECCIÓN / GÉNERO */}
        <div className="space-y-2">
            <Label>Sección / Género</Label>
            <select 
                name="gender" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3"
                value={formData.gender} 
                onChange={handleChange}
            >
                <option value="Mujer">Mujer</option>
                <option value="Hombre">Hombre</option>
                <option value="Niños">Niños</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Unisex">Unisex</option>
            </select>
        </div>

        {/* CATEGORÍA / TIPO DE PRENDA */}
        <div className="space-y-2">
            <Label>Tipo de Prenda (Categoría)</Label>
            <select name="categoryId" className="flex h-10 w-full rounded-md border border-input bg-background px-3" value={formData.categoryId} onChange={handleChange} required>
            <option value="">Seleccionar...</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>
      </div>

      <div className="space-y-2">
          <Label>Imagen Principal</Label>
          <div className="flex gap-4 items-center">
              {/* Previsualización imagen actual si estamos editando */}
              {initialData && initialData.images[0] && !file && (
                  <img src={initialData.images[0].url} className="w-10 h-10 object-cover rounded border" title="Imagen actual" />
              )}
              <Input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])} accept="image/*" required={!initialData} />
          </div>
          {initialData && <p className="text-xs text-gray-400">Sube una imagen solo si quieres cambiar la actual.</p>}
      </div>

      {/* 3. GESTOR DE INVENTARIO */}
      <div className="border border-blue-200 bg-blue-50/50 p-6 rounded-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-blue-200 pb-2">
            <Box className="w-5 h-5 text-blue-600"/>
            <h3 className="font-bold text-blue-900">Variantes e Inventario</h3>
        </div>
        
        <div className="grid md:grid-cols-12 gap-6">
            {/* Panel Izquierdo: Generador */}
            <div className="md:col-span-6 space-y-5 bg-white p-5 rounded-lg shadow-sm border h-fit">
                <div>
                    <Label className="mb-2 block font-bold text-gray-700">1. Color</Label>
                    <div className="flex items-center gap-3">
                        <Input type="color" className="w-14 h-10 p-1 cursor-pointer" value={selectedColor} onChange={e => setSelectedColor(e.target.value)} />
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{selectedColor}</span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <Label className="block font-bold text-gray-700">2. Tallas</Label>
                        {loadingSizes && <span className="text-xs text-gray-400 animate-pulse">Cargando...</span>}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {availableSizes.map(size => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`px-3 py-1 text-sm font-medium rounded border transition-all ${selectedSizes.includes(size) ? 'bg-gray-900 text-white' : 'bg-white border-gray-200'}`}
                            >
                                {size || "?"}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 items-center">
                        <Input placeholder="Agregar (Ej: 44)..." className="h-8 text-sm" value={customSizeInput} onChange={(e) => setCustomSizeInput(e.target.value)} onKeyDown={handleAddCustomSize} />
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Enter para guardar</span>
                    </div>
                </div>

                {selectedSizes.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <Label className="mb-2 block font-bold text-gray-700">3. Stock por Talla</Label>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 grid grid-cols-3 gap-3">
                            {selectedSizes.map(size => (
                                <div key={size} className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase text-center">{size}</span>
                                    <Input type="number" className="h-8 text-center" placeholder="0" value={sizeStocks[size] || ''} onChange={(e) => handleStockChange(size, e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Button type="button" onClick={addBulkVariants} disabled={selectedSizes.length === 0} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                    <ArrowRight className="w-4 h-4 mr-2"/> Agregar Variantes
                </Button>
            </div>

            {/* Panel Derecho: Lista Actual */}
            <div className="md:col-span-6 bg-white rounded-lg border overflow-hidden flex flex-col h-full max-h-[500px]">
                <div className="bg-gray-100 p-3 font-semibold text-sm border-b flex justify-between">
                    <span>Lista Actual ({variants.length})</span>
                </div>
                <div className="overflow-y-auto p-0 flex-1">
                    {variants.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr><th className="p-3 text-left">Color</th><th className="p-3 text-left">Talla</th><th className="p-3 text-left w-20">Stock</th><th className="p-3"></th></tr>
                            </thead>
                            <tbody>
                                {variants.map((v, i) => (
                                    <tr key={i} className="border-t hover:bg-gray-50">
                                        <td className="p-3"><div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border" style={{backgroundColor: v.color}}></div></div></td>
                                        <td className="p-3 font-bold">{v.size}</td>
                                        <td className="p-3"><input type="number" className="w-16 border rounded px-1 text-center" value={v.stock} onChange={(e) => { const n = [...variants]; n[i].stock = e.target.value; setVariants(n); }} /></td>
                                        <td className="p-3 text-right"><button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4"/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <div className="h-full flex items-center justify-center text-gray-400 text-xs">Sin variantes.</div>}
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2"><Label>Descripción</Label><Textarea name="description" value={formData.description} onChange={handleChange} /></div>
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Materiales</Label><Textarea name="materialInfo" value={formData.materialInfo} onChange={handleChange} className="h-24"/></div>
            <div className="space-y-2"><Label>Envíos</Label><Textarea name="shippingInfo" value={formData.shippingInfo} onChange={handleChange} className="h-24"/></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 p-4 bg-gray-50 rounded border">
        <div className="flex items-center gap-2"><Checkbox checked={formData.isNewArrival} onCheckedChange={c => handleCheckbox(c as boolean, 'isNewArrival')} /><Label>Nuevo</Label></div>
        <div className="flex items-center gap-2"><Checkbox checked={formData.isTrending} onCheckedChange={c => handleCheckbox(c as boolean, 'isTrending')} /><Label>Tendencia</Label></div>
        <div className="flex items-center gap-2"><Checkbox checked={formData.isFeatured} onCheckedChange={c => handleCheckbox(c as boolean, 'isFeatured')} /><Label>Destacado</Label></div>
      </div>

      <Button type="submit" className="w-full bg-black text-white h-14 text-lg font-bold shadow-lg hover:bg-gray-800" disabled={loading}>
        {loading ? 'Guardando...' : (initialData ? 'ACTUALIZAR PRODUCTO' : 'CREAR PRODUCTO')}
      </Button>
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
      await fetch('http://localhost:4000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
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
      });
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
        <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Crear Nueva Categoría</h3>
            <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                    <Label>Nombre</Label>
                    <Input placeholder="Ej: Pantalones, Blusas..." value={name} onChange={e => setName(e.target.value)} />
                </div>
                <Button onClick={handleSubmit} disabled={loading} className="bg-black text-white">
                    {loading ? 'Guardando...' : 'Crear'}
                </Button>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Categorías Existentes ({categories.length})</h3>
            {categories.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No hay categorías creadas.</p>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {categories.map((c) => (
                        <div key={c.id} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full border hover:bg-gray-200 transition-colors group">
                            <span className="font-medium text-gray-700">{c.name}</span>
                            {/* Botón de eliminar */}
                            <button 
                                onClick={() => handleDelete(c.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <aside className="md:col-span-3 space-y-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-4">
            <h2 className="font-bold text-lg">Admin Panel</h2>
            <p className="text-xs text-gray-500">Gestión de tienda</p>
          </div>
          <nav className="flex flex-col gap-2">
            <button onClick={() => { setActiveTab('list'); setProductToEdit(null); }} className={`p-3 rounded-lg text-left font-medium transition ${activeTab === 'list' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>📋 Lista de Productos</button>
            <button onClick={() => { setActiveTab('create'); setProductToEdit(null); }} className={`p-3 rounded-lg text-left font-medium transition ${activeTab === 'create' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>➕ Crear Producto</button>
            <button onClick={() => { setActiveTab('categories'); setProductToEdit(null); }} className={`p-3 rounded-lg text-left font-medium transition ${activeTab === 'categories' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>🗂️ Categorías</button>
          </nav>
        </aside>

        <main className="md:col-span-9 bg-white p-6 rounded-xl shadow-sm border min-h-[600px]">
          {activeTab === 'list' && <ProductListManager onEdit={handleEditClick} />}
          
          {activeTab === 'create' && (
             categories.length > 0 
             ? <ProductForm 
                  categories={categories} 
                  onSuccess={handleEditComplete} 
                  initialData={productToEdit} 
                  onCancel={handleEditComplete}
               />
             : <div className="text-center p-10">⚠️ Crea categorías primero en la pestaña Categorías.</div>
          )}

          {activeTab === 'categories' && (
            <div>
                <h2 className="text-xl font-bold mb-6">Gestión de Categorías</h2>
                {/* AQUI ESTA EL CAMBIO IMPORTANTE: USAMOS EL NUEVO GESTOR */}
                <CategoryManager />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}