import React from "react";
import { Order, OrderTrackerContent } from "../components/OrderTracker";

interface Props {
  orders?: Order[];
  onAddToCart?: (productName: string) => void;
}

export function OrderTrackerPage({ orders, onAddToCart }: Props) {
  return (
    <div className="min-h-screen bg-background/50 pt-12 pb-8 flex items-start">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-semibold mb-4">Seguimiento de Pedidos (deshabilitado)</h1>
        <p className="mb-6">Por ahora el seguimiento de pedidos está desactivado en esta primera versión. Pronto habilitaremos historial y rastreo cuando los usuarios puedan crear cuentas.</p>
        <div className="bg-background/80 p-6 rounded-2xl shadow-sm">
          <p className="text-foreground/70">Si necesitas asistencia con un pedido, contáctanos por WhatsApp o correo.</p>
        </div>
      </div>
    </div>
  );
}

export default OrderTrackerPage;
