import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const prisma = new PrismaClient();
const PORT = 4000;

// 1. CONFIGURACIÓN DE MULTER (Para guardar imágenes)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    // Crear carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Nombre único: fecha + nombre original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// MIDDLEWARES
app.use(cors());
app.use(express.json());
// IMPORTANTE: Permitir ver las fotos desde el navegador
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- RUTAS DE CATEGORÍAS ---

// GET Categorías
app.get('/api/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// POST Categoría
app.post('/api/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-');
    
    const result = await prisma.category.create({
      data: { name, slug, description }
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando categoría' });
  }
});

// --- RUTAS DE PRODUCTOS ---
// server/src/index.ts

// GET: Obtener todos los productos (CON FOTOS, VARIANTES Y CATEGORÍA)
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,    // Traer las fotos
        variants: true,  // Traer tallas/colores
        category: true   // Traer nombre de categoría
      },
      orderBy: {
        createdAt: 'desc' // Los más nuevos primero
      }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
});
// POST Producto (CON IMAGEN)
// 'image' es el nombre del campo que enviaremos desde el Frontend
app.post('/api/products', upload.single('imageFile'), async (req, res) => {
  try {
    // Cuando usamos FormData, los datos llegan como Strings, hay que convertirlos
    const { name, description, categoryId, materialInfo, shippingInfo } = req.body;
    const basePrice = parseFloat(req.body.basePrice);
    const isTrending = req.body.isTrending === 'true';
    const isNewArrival = req.body.isNewArrival === 'true';
    const isFeatured = req.body.isFeatured === 'true';

    // Construir la URL de la imagen
    let imageUrl = '';
    if (req.file) {
      // Url completa: http://localhost:4000/uploads/nombre-archivo.jpg
      imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        materialInfo, // <--- AGREGAR ESTO
        shippingInfo, // <--- AGREGAR ESTO
        basePrice,
        categoryId,
        isTrending,
        isNewArrival,
        isFeatured,
        images: {
          create: [{ url: imageUrl, isMain: true }] // Guardamos la URL generada
        },
        variants: {
            create: [
                { size: "S", color: "Negro", stock: 10 },
                { size: "M", color: "Negro", stock: 10 }
            ]
        }
      }
    });

    res.json(product);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: 'Error interno al procesar producto' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});