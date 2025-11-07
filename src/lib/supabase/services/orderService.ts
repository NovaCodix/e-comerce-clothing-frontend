import { supabase } from '../client';

export interface CreateOrderData {
  userId: string;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
  items: Array<{
    productId: string;
    quantity: number;
    size: string;
    color: string;
    price: number;
  }>;
}

export const orderService = {
  /**
   * Crea un nuevo pedido
   */
  async createOrder(orderData: CreateOrderData) {
    // Crear el pedido
    const order = {
      user_id: orderData.userId,
      total: orderData.total,
      shipping_address: orderData.shippingAddress,
      payment_method: orderData.paymentMethod,
      status: 'pending',
      tracking_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };

    const { data: orderCreated, error: orderError } = await (supabase as any)
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (orderError) throw orderError;

    // Crear los items del pedido
    const orderItems = orderData.items.map((item) => ({
      order_id: orderCreated.id,
      product_id: item.productId,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.price,
    }));

    const { error: itemsError } = await (supabase as any)
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Limpiar el carrito del usuario
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', orderData.userId);

    return orderCreated;
  },

  /**
   * Obtiene todos los pedidos de un usuario
   */
  async getOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene un pedido específico
   */
  async getOrder(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Rastrea un pedido por número de seguimiento
   */
  async trackOrder(trackingNumber: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('tracking_number', trackingNumber)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Actualiza el estado de un pedido
   */
  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await (supabase as any)
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Cancela un pedido
   */
  async cancelOrder(orderId: string) {
    return this.updateOrderStatus(orderId, 'cancelled');
  },
};
