import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { 
  Package, 
  Search, 
  Eye, 
  X, 
  CheckCircle, 
  Truck, 
  Clock,
  Ban,
  DollarSign
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  total: number;
  shippingCost?: number;
  shippingType?: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_CONFIG = {
  PENDING: { 
    label: "Pendiente", 
    color: "bg-yellow-600 hover:bg-yellow-700", 
    icon: Clock 
  },
  PAID: { 
    label: "Pagado", 
    color: "bg-green-600 hover:bg-green-700", 
    icon: CheckCircle 
  },
  PROCESSING: { 
    label: "En Preparación", 
    color: "bg-blue-600 hover:bg-blue-700", 
    icon: Package 
  },
  SHIPPED: { 
    label: "Enviado", 
    color: "bg-purple-600 hover:bg-purple-700", 
    icon: Truck 
  },
  DELIVERED: { 
    label: "Entregado", 
    color: "bg-emerald-600 hover:bg-emerald-700", 
    icon: CheckCircle 
  },
  CANCELLED: { 
    label: "Cancelado", 
    color: "bg-red-600 hover:bg-red-700", 
    icon: Ban 
  }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      toast.error('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('¿Estás seguro de cancelar esta orden? El stock se devolverá automáticamente.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/cancel`, {
        method: 'PATCH'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('✅ Orden cancelada y stock restaurado correctamente', {
          description: 'El inventario se actualizará automáticamente en unos segundos',
          duration: 5000
        });
        loadOrders();
        if (selectedOrder?.id === orderId) {
          setIsDetailOpen(false);
        }
      } else {
        toast.error(data.error || 'Error al cancelar la orden');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Estado actualizado a ${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG].label}`);
        // Recargar la lista completa de órdenes
        await loadOrders();
        // Actualizar la orden seleccionada en el modal
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      } else {
        toast.error('Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const viewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerPhone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestión de Órdenes</h1>
          <p className="text-muted-foreground">Administra las órdenes de tu tienda</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Órdenes</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => o.status === 'PENDING').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En Preparación</p>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => o.status === 'PROCESSING').length}
                  </p>
                </div>
                <Truck className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsIncomeModalOpen(true)}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos</p>
                  <p className="text-2xl font-bold">
                    S/ {orders
                      .filter(o => ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status))
                      .reduce((sum, o) => sum + Number(o.total), 0)
                      .toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Segunda fila de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pagados</p>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => o.status === 'PAID').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enviados</p>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => o.status === 'SHIPPED').length}
                  </p>
                </div>
                <Truck className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Entregados</p>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => o.status === 'DELIVERED').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cancelados</p>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => o.status === 'CANCELLED').length}
                  </p>
                </div>
                <Ban className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Buscador */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Buscar por número de orden, cliente o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Órdenes */}
        <Card>
          <CardHeader>
            <CardTitle>Órdenes ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No se encontraron órdenes</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const StatusIcon = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.icon || Clock;
                  const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
                  
                  return (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">#{order.orderNumber}</h3>
                            {statusConfig ? (
                              <Badge 
                                style={{ 
                                  backgroundColor: 
                                    order.status === 'PENDING' ? '#ca8a04' : 
                                    order.status === 'PAID' ? '#16a34a' : 
                                    order.status === 'PROCESSING' ? '#2563eb' : 
                                    order.status === 'SHIPPED' ? '#9333ea' : 
                                    order.status === 'DELIVERED' ? '#059669' : 
                                    order.status === 'CANCELLED' ? '#dc2626' : '#6b7280',
                                  color: 'white',
                                  border: 'none'
                                }}
                              >
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            ) : (
                              <Badge style={{ backgroundColor: '#6b7280', color: 'white', border: 'none' }}>
                                <Clock className="w-3 h-3 mr-1" />
                                {order.status}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Cliente:</span> {order.customerName}
                            </div>
                            <div>
                              <span className="font-medium">Teléfono:</span> {order.customerPhone}
                            </div>
                            <div>
                              <span className="font-medium">Total:</span> S/ {Number(order.total).toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">Fecha:</span> {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewOrderDetail(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          
                          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalle */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Orden #{selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Estado */}
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-5 rounded-xl border border-primary/20">
                <h3 className="font-semibold mb-4 text-lg">Estado de la Orden</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                    const isActive = selectedOrder.status === status;
                    const isDisabled = selectedOrder.status === 'CANCELLED' || selectedOrder.status === 'DELIVERED';
                    
                    return (
                      <Button
                        key={status}
                        size="lg"
                        variant={isActive ? "default" : "outline"}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                        disabled={isActive || isDisabled}
                        style={isActive ? {
                          backgroundColor: 
                            status === 'PENDING' ? '#ca8a04' : 
                            status === 'PAID' ? '#16a34a' : 
                            status === 'PROCESSING' ? '#2563eb' : 
                            status === 'SHIPPED' ? '#9333ea' : 
                            status === 'DELIVERED' ? '#059669' : 
                            status === 'CANCELLED' ? '#dc2626' : '#6b7280',
                          color: 'white',
                          border: 'none'
                        } : {}}
                        className="transition-all"
                      >
                        {React.createElement(config.icon, { className: "w-4 h-4 mr-2" })}
                        {config.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="bg-card border rounded-xl p-8">
                <h3 className="font-semibold mb-6 text-lg flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-sm">👤</span>
                  </div>
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                  <div className="space-y-2.5">
                    <p className="text-sm text-muted-foreground font-medium">Nombre Completo</p>
                    <p className="text-base font-semibold">{selectedOrder.customerName}</p>
                  </div>
                  <div className="space-y-2.5">
                    <p className="text-sm text-muted-foreground font-medium">Teléfono / WhatsApp</p>
                    <p className="text-base font-semibold">{selectedOrder.customerPhone}</p>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div className="space-y-2.5 md:col-span-2">
                      <p className="text-sm text-muted-foreground font-medium">Correo Electrónico</p>
                      <p className="text-base font-semibold">{selectedOrder.customerEmail}</p>
                    </div>
                  )}
                  <div className="space-y-2.5 md:col-span-2">
                    <p className="text-sm text-muted-foreground font-medium">📍 Dirección de Envío</p>
                    <p className="text-base bg-muted/50 p-4 rounded-lg font-medium">
                      {(() => {
                        try {
                          const addr = JSON.parse(selectedOrder.shippingAddress);
                          return `${addr.address}, ${addr.district}, ${addr.reference ? `Ref: ${addr.reference}` : ''}`;
                        } catch {
                          return selectedOrder.shippingAddress;
                        }
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="bg-card border rounded-xl p-8">
                <h3 className="font-semibold mb-6 text-lg flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  Productos Ordenados
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={item.id} className="bg-muted/30 border border-border/50 p-6 rounded-xl hover:border-primary/30 transition-colors">
                      <div className="flex justify-between items-start gap-6">
                        <div className="flex-1">
                          <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-primary text-lg">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-base mb-4">{item.productName}</p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <span className="bg-background px-4 py-2 rounded-full border">
                                  📏 Talla: <strong>{item.size}</strong>
                                </span>
                                <span className="bg-background px-4 py-2 rounded-full border flex items-center gap-2">
                                  🎨 Color: <strong>
                                    {(() => {
                                      const colorMap: Record<string, string> = {
                                        '#000000': 'Negro',
                                        '#FFFFFF': 'Blanco',
                                        '#FF0000': 'Rojo',
                                        '#0000FF': 'Azul',
                                        '#008000': 'Verde',
                                        '#FFFF00': 'Amarillo',
                                        '#FFA500': 'Naranja',
                                        '#800080': 'Morado',
                                        '#FFC0CB': 'Rosa',
                                        '#808080': 'Gris',
                                        '#A52A2A': 'Café',
                                        '#00FFFF': 'Cyan'
                                      };
                                      return colorMap[item.color.toUpperCase()] || item.color;
                                    })()}
                                  </strong>
                                </span>
                                <span className="bg-background px-4 py-2 rounded-full border">
                                  📦 Cantidad: <strong>{item.quantity}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <p className="text-xl font-bold text-primary">S/ {(Number(item.price) * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground mt-1.5">S/ {Number(item.price).toFixed(2)} c/u</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-6">
                <h3 className="font-semibold mb-4 text-lg">Resumen de Montos</h3>
                
                {/* Desglose */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal Productos</span>
                    <span className="font-semibold">
                      S/ {(Number(selectedOrder.total) - Number(selectedOrder.shippingCost || 0)).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2">
                      {selectedOrder.shippingType === 'DELIVERY' ? '🚚 Costo de Envío' : '📍 Recojo en Tienda'}
                    </span>
                    <span className="font-semibold">
                      {Number(selectedOrder.shippingCost || 0) > 0 
                        ? `S/ ${Number(selectedOrder.shippingCost).toFixed(2)}` 
                        : 'Gratis'}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">TOTAL PAGADO</span>
                      <span className="text-3xl font-black" style={{ color: '#16a34a' }}>
                        S/ {Number(selectedOrder.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: '#16a34a' }}>
                  <span className="text-white text-2xl font-black">S/</span>
                </div>
              </div>

              {/* Acciones */}
              {selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'DELIVERED' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="lg"
                    className="flex-1"
                    onClick={() => {
                      handleCancelOrder(selectedOrder.id);
                    }}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancelar Orden y Devolver Stock
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Desglose de Ingresos */}
      <Dialog open={isIncomeModalOpen} onOpenChange={setIsIncomeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-lg font-black">S/</span>
              </div>
              Desglose de Ingresos
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {(() => {
              const paidOrders = orders.filter(o => ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status));
              
              const ingresoNeto = paidOrders.reduce((sum, o) => {
                const productTotal = Number(o.total) - Number(o.shippingCost || 0);
                return sum + productTotal;
              }, 0);

              const totalDelivery = paidOrders.reduce((sum, o) => {
                return sum + Number(o.shippingCost || 0);
              }, 0);

              const totalIngresos = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);

              return (
                <>
                  {/* Ingreso Neto */}
                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                        💰 Ingreso Neto (Productos)
                      </span>
                    </div>
                    <p className="text-3xl font-black text-green-600 dark:text-green-500 mb-3">
                      S/ {ingresoNeto.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Venta de productos sin delivery
                    </p>
                  </div>

                  {/* Delivery */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                        🚚 Ingresos por Delivery
                      </span>
                    </div>
                    <p className="text-3xl font-black text-blue-600 dark:text-blue-500 mb-3">
                      S/ {totalDelivery.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Costos de envío cobrados
                    </p>
                  </div>

                  {/* Separador */}
                  <div className="border-t-2 border-dashed border-border"></div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-950/40 dark:to-green-950/20 p-6 rounded-xl border-2 border-green-300 dark:border-green-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold text-green-800 dark:text-green-300">
                        💵 TOTAL INGRESOS
                      </span>
                    </div>
                    <p className="text-4xl font-black text-green-700 dark:text-green-400">
                      S/ {totalIngresos.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Suma de productos + delivery
                    </p>
                  </div>

                  {/* Información adicional */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <strong>Nota:</strong> Los ingresos por delivery son considerados "pasamanos" 
                      ya que representan el costo del servicio de entrega.
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
