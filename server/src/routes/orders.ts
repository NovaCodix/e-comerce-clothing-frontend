import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Interfaz para los items del carrito
interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  size: string;
  color: string;
}

// Interfaz para datos del cliente
interface CheckoutData {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  items: CartItem[];
  paymentMethod?: 'MANUAL' | 'CARD';
  deliveryCost?: number; // Costo de delivery desde el frontend
  wantsDelivery?: boolean; // Si el usuario eligió delivery
}

/**
 * POST /api/orders/checkout
 * Crea una orden y descuenta el stock de forma transaccional
 */
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const checkoutData: CheckoutData = req.body;

    // Validaciones básicas
    if (!checkoutData.customerName || !checkoutData.customerPhone || !checkoutData.items || checkoutData.items.length === 0) {
      return res.status(400).json({ 
        error: 'Datos incompletos. Se requiere nombre, teléfono e items.' 
      });
    }

    // TRANSACCIÓN: Todo se ejecuta o nada se ejecuta
    const order = await prisma.$transaction(async (tx) => {
      let productsTotal = 0;
      const orderItemsData = [];

      // 1. VALIDAR Y DESCONTAR STOCK POR CADA ITEM
      for (const item of checkoutData.items) {
        // Buscar la variante específica
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true }
        });

        if (!variant) {
          throw new Error(`Variante ${item.variantId} no encontrada`);
        }

        // Validar stock suficiente
        if (variant.stock < item.quantity) {
          throw new Error(
            `Stock insuficiente para ${variant.product.name} (${item.size}/${item.color}). ` +
            `Disponible: ${variant.stock}, Solicitado: ${item.quantity}`
          );
        }

        // Descontar el stock
        const newStock = variant.stock - item.quantity;
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: newStock }
        });

        console.log(`📦 Stock descontado: Producto "${variant.product.name}" - Variante ${variant.id} - Cantidad: -${item.quantity} - Nuevo stock: ${newStock}`);

        // Calcular precio (usar discountPrice si existe, sino basePrice)
        const price = variant.product.discountPrice || variant.product.basePrice;
        const subtotal = Number(price) * item.quantity;
        productsTotal += subtotal;

        // Preparar datos para OrderItem
        orderItemsData.push({
          productId: variant.product.id,
          variantId: variant.id,
          productName: variant.product.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: price
        });
      }

      // 2. CALCULAR COSTOS DE ENVÍO
      const shippingCost = checkoutData.wantsDelivery ? (checkoutData.deliveryCost || 10.00) : 0.00;
      const shippingType = checkoutData.wantsDelivery ? 'DELIVERY' : 'PICKUP';
      const grandTotal = productsTotal + shippingCost;

      // 3. CREAR LA ORDEN
      const newOrder = await tx.order.create({
        data: {
          customerName: checkoutData.customerName,
          customerEmail: checkoutData.customerEmail,
          customerPhone: checkoutData.customerPhone,
          shippingAddress: checkoutData.shippingAddress,
          total: grandTotal,
          shippingCost: shippingCost,
          shippingType: shippingType,
          paymentMethod: checkoutData.paymentMethod || 'MANUAL',
          status: 'PENDING',
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true
            }
          }
        }
      });

      return newOrder;
    });

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        items: order.items
      },
      message: 'Orden creada exitosamente. Stock reservado.'
    });

  } catch (error: any) {
    console.error('Error en checkout:', error);
    
    // Si es error de stock, enviar mensaje específico
    if (error.message.includes('Stock insuficiente')) {
      return res.status(409).json({ 
        error: error.message,
        type: 'INSUFFICIENT_STOCK'
      });
    }

    res.status(500).json({ 
      error: 'Error al procesar la orden',
      details: error.message 
    });
  }
});

/**
 * GET /api/orders
 * Obtener todas las órdenes (para admin)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

/**
 * GET /api/orders/:id
 * Obtener una orden específica
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            },
            variant: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
});

/**
 * PATCH /api/orders/:id/cancel
 * Cancelar una orden y devolver el stock automáticamente
 */
router.patch('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    console.log(`\n🔴 ============================================`);
    console.log(`🔴 SOLICITUD DE CANCELACIÓN RECIBIDA`);
    console.log(`🔴 Orden ID: ${id}`);
    console.log(`🔴 ============================================\n`);

    // TRANSACCIÓN: Cambiar estado y devolver stock
    const cancelledOrder = await prisma.$transaction(async (tx) => {
      // Buscar la orden
      const order = await tx.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              variant: true
            }
          }
        }
      });

      if (!order) {
        throw new Error('Orden no encontrada');
      }

      // Validar que no esté ya cancelada
      if (order.status === 'CANCELLED') {
        throw new Error('La orden ya está cancelada');
      }

      // Validar que no esté entregada (no se puede cancelar una entrega)
      if (order.status === 'DELIVERED') {
        throw new Error('No se puede cancelar una orden ya entregada');
      }

      // 1. DEVOLVER STOCK A CADA VARIANTE
      console.log(`🔄 Iniciando restauración de stock para orden ${id}`);
      console.log(`📋 Orden tiene ${order.items.length} items`);
      
      for (const item of order.items) {
        console.log(`\n📦 Procesando item: ${item.productName}`);
        console.log(`   - Item ID: ${item.id}`);
        console.log(`   - Variant ID: ${item.variantId}`);
        console.log(`   - Cantidad a restaurar: ${item.quantity}`);
        
        if (!item.variantId) {
          console.warn(`⚠️  OrderItem ${item.id} no tiene variantId asignado`);
          continue;
        }

        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId }
        });

        if (!variant) {
          console.warn(`⚠️  Variante ${item.variantId} no encontrada para OrderItem ${item.id}`);
          continue;
        }

        console.log(`   - Stock actual: ${variant.stock}`);
        const newStock = variant.stock + item.quantity;
        console.log(`   - Stock después de restaurar: ${newStock}`);

        // Restaurar el stock
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: newStock
          }
        });

        console.log(`✅ Stock restaurado exitosamente: "${item.productName}" - Variante ${item.variantId}`);
      }
      
      console.log(`\n✅ Restauración de stock completada para orden ${id}\n`);

      // 2. ACTUALIZAR ESTADO DE LA ORDEN
      const updated = await tx.order.update({
        where: { id },
        data: {
          status: 'CANCELLED'
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true
            }
          }
        }
      });

      return updated;
    });

    res.json({
      success: true,
      message: 'Orden cancelada y stock devuelto correctamente',
      order: cancelledOrder
    });

  } catch (error: any) {
    console.error('Error cancelando orden:', error);
    res.status(500).json({ 
      error: 'Error al cancelar la orden',
      details: error.message 
    });
  }
});

/**
 * PATCH /api/orders/:id/status
 * Actualizar el estado de una orden (para admin)
 */
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar que el status sea válido
    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      }
    });

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
});

export default router;
