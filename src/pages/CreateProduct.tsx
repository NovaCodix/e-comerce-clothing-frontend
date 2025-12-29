import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';

// --- COMPONENTE 1: FORMULARIO DE CATEGORÍA ---
function CategoryForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('✅ Categoría creada');
        setFormData({ name: '', description: '' }); // Limpiar
        onSuccess(); // Avisar al padre para recargar lista
      }
    } catch (err) {
      alert('Error creando categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label>Nombre de la Categoría</Label>
        <Input 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          placeholder="Ej: Zapatos, Verano, Ofertas" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label>Descripción (Opcional)</Label>
        <Textarea 
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
        />
      </div>
      <Button disabled={loading} className="bg-black text-white">{loading ? 'Guardando...' : 'Crear Categoría'}</Button>
    </form>
  );
}

// --- COMPONENTE 2: FORMULARIO DE PRODUCTO (CON FOTO) ---
function ProductForm({ categories }: { categories: any[] }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null); // Estado para el archivo real

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    categoryId: '',
    isTrending: false,
    isNewArrival: true,
    isFeatured: false,
    materialInfo: '',
    shippingInfo: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckbox = (checked: any, field: string) => {
    setFormData({ ...formData, [field]: !!checked });
  };

  // Manejar selección de archivo
  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      // USAMOS FORMDATA PARA ENVIAR ARCHIVOS
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('basePrice', formData.basePrice);
      data.append('categoryId', formData.categoryId);
      data.append('isTrending', String(formData.isTrending));
      data.append('isNewArrival', String(formData.isNewArrival));
      data.append('isFeatured', String(formData.isFeatured));
      data.append('materialInfo', formData.materialInfo);
      data.append('shippingInfo', formData.shippingInfo);
      
      if (file) {
        data.append('imageFile', file); // Aquí va el archivo real
      }

      const res = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        // No ponemos Content-Type header, el navegador lo pone automático con FormData
        body: data, 
      });

      if (res.ok) {
        alert('✅ Producto creado con imagen');
        navigate('/'); // Ir al inicio para ver los cambios
      } else {
        alert('Error al crear');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Nombre</Label>
          <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Polo Blanco" />
        </div>
        <div className="space-y-2">
          <Label>Precio (S/.)</Label>
          <Input name="basePrice" type="number" step="0.01" value={formData.basePrice} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Categoría</Label>
        <select 
            name="categoryId" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.categoryId} 
            onChange={handleChange} 
            required
        >
          <option value="">Seleccionar...</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Imagen del Producto</Label>
        <Input type="file" onChange={handleFileChange} accept="image/*" className="cursor-pointer" />
        <p className="text-xs text-gray-500">Sube una imagen (JPG, PNG)</p>
      </div>

      <div className="space-y-2">
        <Label>Descripción</Label>
        <Textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-2">
    <Label>Materiales y Cuidado</Label>
    <Textarea 
      name="materialInfo" 
      value={formData.materialInfo} 
      onChange={handleChange} 
      placeholder="Ej: 100% Algodón. Lavar en frío."
      className="h-32"
    />
  </div>
  <div className="space-y-2">
    <Label>Envío y Devoluciones (Opcional)</Label>
    <Textarea 
      name="shippingInfo" 
      value={formData.shippingInfo} 
      onChange={handleChange} 
      placeholder="Si lo dejas vacío, se usará el texto por defecto."
      className="h-32"
    />
  </div>
</div>

      <div className="flex gap-6 p-4 bg-gray-50 rounded border">
        <div className="flex items-center gap-2">
          <Checkbox checked={formData.isNewArrival} onCheckedChange={(c) => handleCheckbox(c, 'isNewArrival')} />
          <Label>Nuevo</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={formData.isTrending} onCheckedChange={(c) => handleCheckbox(c, 'isTrending')} />
          <Label>Tendencia</Label>
        </div>
        <div className="flex items-center gap-2">
            <Checkbox checked={formData.isFeatured} onCheckedChange={(c) => handleCheckbox(c, 'isFeatured')} />
            <Label>Destacado</Label>
        </div>
      </div>

      <Button type="submit" className="w-full bg-black text-white" disabled={loading}>
        {loading ? 'Subiendo...' : 'Guardar Producto'}
      </Button>
    </form>
  );
}

// --- COMPONENTE PRINCIPAL (EL CONTENEDOR) ---
export default function AdminManager() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [categories, setCategories] = useState<any[]>([]);

  // Función para recargar categorías
  const fetchCategories = () => {
    fetch('http://localhost:4000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* SIDEBAR */}
        <aside className="md:col-span-3 bg-white/80 rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-xl">AD</div>
            <div>
              <div className="text-sm text-gray-600">Administrador</div>
              <div className="text-xs text-gray-400">admin@estilo.com</div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg transition ${activeTab === 'products' ? 'bg-rose-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="text-lg">📦</span>
              <span className="font-medium">Productos</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg transition ${activeTab === 'categories' ? 'bg-rose-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="text-lg">🗂️</span>
              <span className="font-medium">Categorías</span>
            </button>
          </nav>

          <div className="mt-6 text-xs text-gray-400">
            Consejos: crea categorías antes de productos para organizarlos mejor.
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="md:col-span-9">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-extrabold text-gray-900">{activeTab === 'products' ? 'Crear Nuevo Producto' : 'Crear Nueva Categoría'}</h1>
              <div className="hidden md:flex items-center gap-3">
                <Button variant={activeTab === 'products' ? 'default' : 'outline'} onClick={() => setActiveTab('products')}>Productos</Button>
                <Button variant={activeTab === 'categories' ? 'default' : 'outline'} onClick={() => setActiveTab('categories')}>Categorías</Button>
              </div>
            </div>

            <div className="space-y-6">
              {activeTab === 'products' ? (
                categories.length === 0 ? (
                  <div className="text-center p-6 bg-yellow-50 text-yellow-800 rounded">
                    <div className="font-semibold">⚠️ Primero debes crear al menos una categoría.</div>
                    <div className="mt-3">
                      <Button variant="link" onClick={() => setActiveTab('categories')}>Ir a Categorías</Button>
                    </div>
                  </div>
                ) : (
                  <ProductForm categories={categories} />
                )
              ) : (
                <>
                  <CategoryForm onSuccess={fetchCategories} />

                  <div className="mt-6 border-t pt-6">
                    <h3 className="font-semibold mb-4">Categorías Existentes</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <span key={c.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{c.name}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}