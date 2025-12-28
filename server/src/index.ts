// server/src/index.ts
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// RUTA DE PRUEBA
app.get('/api/products', async (req, res) => {
  try {
    // Intenta obtener productos. Si falla, revisa si tu tabla se llama 'Product' o 'products'
    const products = await prisma.products.findMany(); 
    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al conectar con la BD' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor LIMPIO corriendo en http://localhost:${PORT}`);
});