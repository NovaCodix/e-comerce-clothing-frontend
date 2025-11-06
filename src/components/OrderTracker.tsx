import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Package, Truck, CheckCircle, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

export interface Order {
  id: string;
  orderNumber: string;
  status: "processing" | "shipped" | "in-transit" | "delivered";
  items: { name: string; quantity: number }[];
  total: number;
  createdAt: Date;
  estimatedDelivery: Date;
  trackingSteps: {
    label: string;
    completed: boolean;
    date?: Date;
  }[];
}

interface OrderTrackerProps {
  open: boolean;
  onClose: () => void;
  // Puedes pasar un pedido específico (compatibilidad hacia atrás)
  order?: Order | null;
  // O pasar una lista de pedidos para mostrar historial y seleccionar
  orders?: Order[];
}

const statusIcons = {
  processing: Package,
  shipped: Truck,
  "in-transit": Truck,
  delivered: CheckCircle,
};

const statusLabels = {
  processing: "Procesando",
  shipped: "Enviado",
  "in-transit": "En Tránsito",
  delivered: "Entregado",
};

const statusColors = {
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  "in-transit": "bg-orange-500",
  delivered: "bg-green-500",
};

// Extracted content so it can be used as a modal or as a full page
export interface OrderTrackerContentProps {
    order?: Order | null;
    orders?: Order[];
  onAddToCart?: (productName: string) => void;
  }

  export function OrderTrackerContent({ order, orders, onAddToCart }: OrderTrackerContentProps) {
    // selectedOrder: can come from single `order` prop (backwards compat) or from `orders` list
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(() => {
      if (order) return order.id;
      if (orders && orders.length) {
        // pick the most recent order by createdAt
        const recent = orders.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
        return recent.id;
      }
      return null;
    });

    const activeOrders = orders ? orders.filter((o) => o.status !== "delivered") : [];
    const pastOrders = orders ? orders.filter((o) => o.status === "delivered") : [];

    // UI state: filter tabs and search (simplified: Todos / Procesando / Entregado)
    const [filter, setFilter] = useState<"all" | "processing" | "delivered">("all");
    const [query, setQuery] = useState("");

    // sort orders by createdAt desc
    const sortDesc = (arr: Order[]) => [...arr].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // When filter === 'processing' we include any non-delivered status (processing/shipped/in-transit)
    const filteredActive = sortDesc(activeOrders).filter((o) => {
      if (filter === "processing" && o.status === "delivered") return false;
      if (filter === "delivered") return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.items.some((it) => it.name.toLowerCase().includes(q)) ||
          o.id.toLowerCase().includes(q)
        );
      }
      return true;
    });

    const filteredPast = sortDesc(pastOrders).filter((o) => {
      if (filter === "processing") return false;
      if (filter === "delivered" || filter === "all") {
        if (query) {
          const q = query.toLowerCase();
          return (
            o.orderNumber.toLowerCase().includes(q) ||
            o.items.some((it) => it.name.toLowerCase().includes(q)) ||
            o.id.toLowerCase().includes(q)
          );
        }
        return true;
      }
      return false;
    });

    // derive selected order object
    const selectedOrder =
      (orders && orders.find((o) => o.id === selectedOrderId)) || order || null;

    // progress helper
    const getProgress = (o: Order) =>
      o.status === "processing" ? 25 : o.status === "shipped" ? 50 : o.status === "in-transit" ? 75 : 100;

    // small helper to generate an inline SVG placeholder image (no external requests)
    const svgPlaceholder = (label?: string, w = 160, h = 120, bg = '#f3f3f3') =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><rect width='100%' height='100%' fill='${bg}' rx='8' ry='8'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='#9b9b9b'>${(label || 'Articulo').slice(0,18)}</text></svg>`
      )}`;

    return (
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: orders list (if provided) */}
        {orders && orders.length > 0 && (
          <aside className="w-full lg:w-96 p-2">
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-foreground">Mis pedidos</h4>
                <div className="hidden sm:block">
                  <input
                    placeholder="Nombre del artículo / ID del pedido / Número de Seguimiento"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-72 px-3 py-2 rounded-md border border-white/20 bg-white/95 dark:bg-[#071522] text-foreground"
                  />
                </div>
              </div>

              {/* tabs */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[{ key: "all", label: "Todos" }, { key: "processing", label: "Procesando" }, { key: "delivered", label: "Entregado" }].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setFilter(t.key as any)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      filter === t.key ? "bg-[#b8a89a] text-white" : "bg-transparent border border-white/10 text-foreground/80"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active / current orders (filtered) */}
            {filteredActive.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-foreground/90 mb-2">Pedidos activos</div>
                <div className="flex flex-wrap gap-4 pr-2 pb-2">
                  {filteredActive.map((o) => {
                    const totalItems = o.items.reduce((s, it) => s + it.quantity, 0);
                    return (
                      <div
                        key={o.id}
                        onClick={() => setSelectedOrderId(o.id)}
                        className={`inline-block flex-shrink-0 w-full sm:w-[900px] min-h-[160px] cursor-pointer p-6 rounded-2xl border-2 ${selectedOrderId === o.id ? "border-[#b8a89a] bg-[#b8a89a]/6 shadow-md" : "border-white/20 bg-transparent shadow-sm"}`}
                      >
                        <div className="flex gap-4 items-center h-full">
                                  <div className="flex-shrink-0 flex gap-2">
                                    {o.items.slice(0, 5).map((it, i) => (
                                    <img key={i} src={svgPlaceholder(it.name, 160, 120)} alt={it.name} className="w-16 h-16 object-cover rounded-md" />
                                  ))}
                                  </div>
                                  <div className="flex-1 flex flex-col justify-between h-full">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-foreground/60">Nº Pedido:</span>
                                  <span className="text-sm font-semibold text-foreground">{o.orderNumber}</span>
                                </div>
                                <div className="text-sm text-foreground font-semibold">S/ {o.total.toFixed(2)}</div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-xs text-foreground/70">{o.createdAt.toLocaleDateString()}</div>
                                <div className="text-xs text-foreground/70">{totalItems} artículos</div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3 justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // track logic: tracking disabled for now but inform user correctly
                                  if (o.status === "delivered") {
                                    toast.info("El pedido ya ha sido entregado.");
                                  } else {
                                    toast.info("Rastreo temporalmente deshabilitado. Próximamente habilitaremos esta función.");
                                  }
                                }}
                                className="px-3 py-1 rounded-md border border-gray-300 dark:border-white/10 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition text-gray-700 dark:text-foreground"
                              >
                                Rastrear
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // devolución validation: only allowed if delivered and within 30 days from createdAt
                                  if (o.status !== "delivered") {
                                    toast.error("No se puede solicitar devolución hasta que el pedido esté entregado.");
                                    return;
                                  }
                                  const days = Math.floor((Date.now() - o.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                                  if (days <= 30) {
                                    toast.success("Solicitud de devolución iniciada. Nuestro equipo validará tu solicitud.");
                                  } else {
                                    toast.error("La solicitud de devolución excede el plazo permitido (30 días desde la compra).");
                                  }
                                }}
                                className="px-3 py-1 rounded-md border border-gray-300 dark:border-white/10 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition text-gray-700 dark:text-foreground"
                              >
                                Devolución/Reembolso
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onAddToCart) {
                                    // Contar cuántos artículos se añadirán
                                    const totalItems = o.items.reduce((sum, it) => sum + it.quantity, 0);
                                    
                                    // add each item quantity times
                                    o.items.forEach((it) => {
                                      for (let i = 0; i < it.quantity; i++) {
                                        try {
                                          onAddToCart(it.name);
                                        } catch (err) {
                                          // ignore individual failures
                                        }
                                      }
                                    });
                                    
                                    // Mostrar una sola notificación con el total
                                    toast.success(`${totalItems} artículo${totalItems > 1 ? 's' : ''} añadido${totalItems > 1 ? 's' : ''} al carrito`);
                                  } else {
                                    toast.success("Artículos añadidos al carrito para comprar de nuevo.");
                                  }
                                }}
                                className="px-4 py-2 rounded-md bg-[#ff8a00] hover:bg-[#e67a00] text-gray-900 dark:text-white text-sm font-medium w-44 transition shadow-sm"
                              >
                                Comprar de nuevo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past orders / history (filtered) */}
            <div>
              <div className="text-sm font-medium text-foreground/90 mb-2">Historial de compras</div>
              {filteredPast.length === 0 ? (
                <div className="text-sm text-foreground/70">No hay pedidos anteriores.</div>
              ) : (
                <div className="flex flex-wrap gap-4 pr-2 pb-2">
                  {filteredPast.map((o) => {
                    const totalItems = o.items.reduce((s, it) => s + it.quantity, 0);
                    return (
                      <div
                        key={o.id}
                        onClick={() => setSelectedOrderId(o.id)}
                        className={`inline-block flex-shrink-0 w-full sm:w-[900px] min-h-[160px] cursor-pointer p-6 rounded-2xl border-2 ${selectedOrderId === o.id ? "border-[#b8a89a] bg-[#b8a89a]/6 shadow-md" : "border-white/20 bg-transparent shadow-sm"}`}
                      >
                        <div className="flex gap-4 items-center">
                          <div className="flex-shrink-0 flex gap-2">
                            {o.items.slice(0, 5).map((it, i) => (
                            <img key={i} src={svgPlaceholder(it.name, 160, 120)} alt={it.name} className="w-16 h-16 object-cover rounded-md" />
                          ))}
                          </div>
                          <div className="flex-1">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-foreground/60">Nº Pedido:</span>
                                  <span className="text-sm font-semibold text-foreground">{o.orderNumber}</span>
                                </div>
                                <div className="text-sm text-foreground font-semibold">S/ {o.total.toFixed(2)}</div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-xs text-foreground/70">Entregado el {o.createdAt.toLocaleDateString()}</div>
                                <div className="text-xs text-foreground/70">{totalItems} artículos</div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3 justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrderId(o.id);
                                }}
                                className="px-3 py-1 rounded-md border border-gray-300 dark:border-white/10 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition text-gray-700 dark:text-foreground"
                              >
                                Ver detalles del pedido
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onAddToCart) {
                                    // Contar cuántos artículos se añadirán
                                    const totalItems = o.items.reduce((sum, it) => sum + it.quantity, 0);
                                    
                                    o.items.forEach((it) => {
                                      for (let i = 0; i < it.quantity; i++) {
                                        try {
                                          onAddToCart(it.name);
                                        } catch (err) {}
                                      }
                                    });
                                    
                                    // Mostrar una sola notificación con el total
                                    toast.success(`${totalItems} artículo${totalItems > 1 ? 's' : ''} añadido${totalItems > 1 ? 's' : ''} al carrito`);
                                  } else {
                                    toast.success("Artículos añadidos al carrito para comprar de nuevo.");
                                  }
                                }}
                                className="px-4 py-2 rounded-md bg-[#ff8a00] hover:bg-[#e67a00] text-gray-900 dark:text-white text-sm font-medium w-44 transition shadow-sm"
                              >
                                Comprar de nuevo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Center: details */}


        {/* Right summary sidebar */}
        {selectedOrder && (
          <aside className="hidden lg:block w-96 p-4">
            <div className="sticky top-6 space-y-4">
              {/* Summary card */}
              <div className="p-4 rounded-lg bg-white/95 dark:bg-[#061219] border border-white/10 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-foreground/70">Resumen</p>
                    <h4 className="font-semibold text-lg mt-1">{statusLabels[selectedOrder.status]}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`${statusColors[selectedOrder.status]} text-white p-2 rounded-full shadow`}> 
                      {(() => {
                        const Icon = statusIcons[selectedOrder.status];
                        return <Icon className="w-5 h-5" />;
                      })()}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-foreground/70">Total a pagar</p>
                      <div className="text-xl font-semibold">S/ {selectedOrder.total.toFixed(2)}</div>
                    </div>
                    <div className="text-right text-sm text-foreground/60">{selectedOrder.createdAt.toLocaleDateString()}</div>
                  </div>
                  <div className="mt-3">
                    <Progress value={getProgress(selectedOrder)} className="h-2 rounded-full" />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <button className="w-full px-3 py-2 rounded-md bg-[#b8a89a] hover:bg-[#a89688] text-white transition shadow-sm font-medium">Copiar monto</button>
                  <button className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-white/10 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition font-medium">Enviar comprobante</button>
                </div>
              </div>

              {/* Delivery / quick info */}
              <div className="p-4 rounded-lg bg-muted/30 dark:bg-[#071522] border border-white/10">
                {selectedOrder.status === "delivered" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <p className="text-sm font-semibold">Entrega recibida</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">Fecha de entrega</p>
                        <p className="text-sm text-foreground font-medium">
                          {selectedOrder.estimatedDelivery.toLocaleDateString("es-ES", { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                      </div>
                      
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-foreground/70 leading-relaxed">
                          Tu compra ha sido entregada exitosamente. El comprobante fue confirmado y el despacho se completó según lo programado.
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-2 pt-2">
                        <MapPin className="w-4 h-4 text-foreground/60 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-foreground/60">Dirección de entrega</p>
                          <p className="text-xs text-foreground/80 mt-0.5">
                            Entregado en la dirección registrada
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-3 flex gap-2">
                        <button className="flex-1 px-3 py-2 rounded-md text-xs border border-gray-300 dark:border-white/10 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition font-medium">
                          Ver comprobante
                        </button>
                        <button className="flex-1 px-3 py-2 rounded-md text-xs border border-gray-300 dark:border-white/10 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition font-medium">
                          Descargar factura
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-foreground/80 mb-2">Entrega estimada</p>
                    <p className="text-sm text-foreground font-medium">{selectedOrder.estimatedDelivery.toLocaleDateString("es-ES", { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <p className="text-xs text-foreground/70 mt-2">Después de enviar comprobante confirmaremos la recepción y procederemos con el despacho.</p>
                  </>
                )}
              </div>

              {/* Compact items preview */}
              <div className="p-4 rounded-lg bg-white/95 dark:bg-[#061219] border border-white/10">
                <p className="text-sm text-foreground/80 mb-2">Artículos</p>
                <div className="space-y-2">
                  {selectedOrder.items.slice(0, 5).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={svgPlaceholder(it.name, 80, 60)} alt={it.name} className="w-10 h-10 object-cover rounded-md" />
                        <div>
                          <div className="text-sm text-foreground">{it.name}</div>
                          <div className="text-xs text-foreground/70">x{it.quantity}</div>
                        </div>
                      </div>
                      <div className="text-sm text-foreground/70"> </div>
                    </div>
                  ))}
                  {selectedOrder.items.length > 5 && <div className="text-xs text-foreground/70">y {selectedOrder.items.length - 5} más...</div>}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    );
  }

// Modal wrapper (backwards compatible)
export function OrderTracker({ open, onClose, order, orders }: OrderTrackerProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[85vw] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>Seguimiento de Pedido</DialogTitle>
          <DialogDescription className="text-foreground/70">Revisa el estado y ubicación de tus pedidos pasados y actuales</DialogDescription>
        </DialogHeader>

        <OrderTrackerContent order={order} orders={orders} />
      </DialogContent>
    </Dialog>
  );
}
