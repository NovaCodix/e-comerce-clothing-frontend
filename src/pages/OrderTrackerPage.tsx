import React from "react";
import { Order, OrderTrackerContent } from "../components/OrderTracker";

interface Props {
  orders?: Order[];
  onAddToCart?: (productName: string) => void;
}

export function OrderTrackerPage({ orders, onAddToCart }: Props) {
  return (
    // increase top padding so the title is visually separated from the fixed header
    <div className="min-h-screen bg-background/50 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-8">
        {/* Adding margin-top for space above the title */}
        <div className="mt-8"> {/* Aumento el margen superior */}
          <h1 className="text-2xl font-semibold mb-2">Seguimiento de Pedido</h1>
          <p className="text-foreground/70 mb-6">Revisa el estado y ubicación de tus pedidos pasados y actuales</p>
        </div>

        <div className="bg-background/80 p-8 rounded-2xl shadow-sm">
          <OrderTrackerContent orders={orders} onAddToCart={onAddToCart} />
        </div>
      </div>
    </div>
  );
}

export default OrderTrackerPage;
