import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const prisma = new PrismaClient();
const PORT = 4000;

// 1. CONFIGURACIÓN MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- RUTAS DE CONFIGURACIÓN (TALLAS) ---

// GET: Obtener todas las tallas disponibles
app.get('/api/sizes', async (req, res) => {
  try {
    let sizes = await prisma.size.findMany({ orderBy: { value: 'asc' } });
    
    // Si la base de datos está vacía, devolvemos las default (y opcionalmente las guardamos)
    if (sizes.length === 0) {
      const defaults = ["XS", "S", "M", "L", "XL", "XXL"];
      // Las creamos en la BD para la próxima vez
      await prisma.size.createMany({
        data: defaults.map(v => ({ value: v })),
        skipDuplicates: true
      });
      sizes = await prisma.size.findMany({ orderBy: { value: 'asc' } });
    }
    
    res.json(sizes);
  } catch (error) {
    res.status(500).json({ error: 'Error cargando tallas' });
  }
});

// POST: Crear una nueva talla (Solo si no existe)
app.post('/api/sizes', async (req, res) => {
  try {
    const { value } = req.body;
    const cleanValue = value.trim().toUpperCase();
    
    // Usamos upsert para no duplicar si ya existe
    const size = await prisma.size.upsert({
      where: { value: cleanValue },
      update: {},
      create: { value: cleanValue }
    });
    
    res.json(size);
  } catch (error) {
    res.status(500).json({ error: 'Error guardando talla' });
  }
});


// --- RUTAS DE CATEGORÍAS ---
app.get('/api/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-');
    const result = await prisma.category.create({ data: { name, slug, description } });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error creando categoría' });
  }
});
// DELETE: Eliminar categoría
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    // Es posible que falle si hay productos usando esta categoría
    res.status(500).json({ error: 'Error eliminando categoría (puede estar en uso)' });
  }
});
// --- RUTAS DE PRODUCTOS ---

app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, variants: true, category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando producto' });
  }
});

app.post('/api/products', upload.single('imageFile'), async (req, res) => {
  try {
    const { name, description, categoryId, gender,materialInfo, shippingInfo } = req.body;
    const basePrice = parseFloat(req.body.basePrice);
    const discountPrice = req.body.discountPrice && parseFloat(req.body.discountPrice) > 0 
        ? parseFloat(req.body.discountPrice) 
        : null;

    const isTrending = req.body.isTrending === 'true';
    const isNewArrival = req.body.isNewArrival === 'true';
    const isFeatured = req.body.isFeatured === 'true';
    const isActive = req.body.isActive === 'true';

    let variants = [];
    if (req.body.variants) {
      variants = JSON.parse(req.body.variants);
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();

    const product = await prisma.product.create({
      data: {
        name, slug, description, materialInfo, shippingInfo, basePrice, discountPrice,
        categoryId, isTrending, isNewArrival, isFeatured, isActive,gender,
        images: { create: [{ url: imageUrl, isMain: true }] },
        variants: {
          create: variants.map((v: any) => ({
            size: v.size,
            color: v.color,
            stock: parseInt(v.stock)
          }))
        }
      }
    });
    res.json(product);
  } catch (error) {
    console.error("Error backend:", error);
    res.status(500).json({ error: 'Error creando producto' });
  }
});

// ... (Tus otros endpoints)

// PUT: ACTUALIZAR PRODUCTO
app.put('/api/products/:id', upload.single('imageFile'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, materialInfo,gender, shippingInfo } = req.body;
    
    // Conversiones de tipos
    const basePrice = parseFloat(req.body.basePrice);
    const discountPrice = req.body.discountPrice && parseFloat(req.body.discountPrice) > 0 
        ? parseFloat(req.body.discountPrice) 
        : null;

    const isTrending = req.body.isTrending === 'true';
    const isNewArrival = req.body.isNewArrival === 'true';
    const isFeatured = req.body.isFeatured === 'true';
    const isActive = req.body.isActive === 'true';

    let variants = [];
    if (req.body.variants) {
      variants = JSON.parse(req.body.variants);
    }

    // Lógica de Imagen: Si viene archivo nuevo, se usa. Si no, no tocamos la imagen.
    let imageData = {};
    if (req.file) {
      const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
      // Primero borramos las viejas (opcional, pero limpio)
      await prisma.productImage.deleteMany({ where: { productId: id } });
      // Preparamos la nueva
      imageData = {
        images: {
          create: [{ url: imageUrl, isMain: true }]
        }
      };
    }

    // TRANSACCIÓN DE ACTUALIZACIÓN
    const product = await prisma.$transaction(async (prisma) => {
      // 1. Actualizar datos básicos
      const updated = await prisma.product.update({
        where: { id },
        data: {
          name, slug: name.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
          description, materialInfo, shippingInfo, basePrice, discountPrice,
          categoryId, isTrending, isNewArrival, isFeatured, isActive,gender,
          ...imageData // Solo actualiza imagen si hubo archivo
        }
      });

      // 2. Actualizar Variantes (Estrategia: Borrar viejas -> Crear nuevas)
      // Esto evita conflictos complejos de IDs si cambiaste tallas o colores
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      
      if (variants.length > 0) {
        await prisma.productVariant.createMany({
          data: variants.map((v: any) => ({
            productId: id,
            size: v.size,
            color: v.color,
            stock: parseInt(v.stock)
          }))
        });
      }

      return updated;
    });

    res.json(product);
  } catch (error) {
    console.error("Error actualizando:", error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Checkout (Mantener lógica previa o simplificada)
app.post('/api/checkout', async (req, res) => {
    // ... Tu lógica de checkout existente ...
    res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});