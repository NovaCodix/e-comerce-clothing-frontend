import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Package, Truck, CheckCircle, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { Progress } from "./ui/progress";

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
  order: Order | null;
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

export function OrderTracker({ open, onClose, order }: OrderTrackerProps) {
  if (!order) return null;

  const StatusIcon = statusIcons[order.status];
  const progress = 
    order.status === "processing" ? 25 :
    order.status === "shipped" ? 50 :
    order.status === "in-transit" ? 75 : 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>Seguimiento de Pedido</DialogTitle>
          <DialogDescription>
            Revisa el estado y ubicación de tu pedido en tiempo real
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Number & Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Número de Pedido</p>
                <h3 className="text-2xl">{order.orderNumber}</h3>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`${statusColors[order.status]} text-white p-4 rounded-full`}
              >
                <StatusIcon className="w-8 h-8" />
              </motion.div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estado:</span>
                <span className="">{statusLabels[order.status]}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="">Historial de Seguimiento</h4>
            <div className="relative">
              {order.trackingSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 pb-8 last:pb-0 relative"
                >
                  {/* Timeline line */}
                  {index < order.trackingSteps.length - 1 && (
                    <div className="absolute left-5 top-10 w-0.5 h-full bg-border" />
                  )}

                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      step.completed
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-current" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className={step.completed ? "" : "text-muted-foreground"}>
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-sm text-muted-foreground">
                        {step.date.toLocaleString("es-ES", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-secondary p-4 rounded-xl flex items-start gap-3"
          >
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="mb-1">Entrega Estimada</p>
              <p className="text-sm text-muted-foreground">
                {order.estimatedDelivery.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </motion.div>

          {/* Order Items */}
          <div className="space-y-3">
            <h4 className="">Artículos del Pedido</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">x{item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="">Total</span>
              <span className="">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
