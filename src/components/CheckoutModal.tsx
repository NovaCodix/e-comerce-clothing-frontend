import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { CreditCard, Smartphone, DollarSign } from "lucide-react";
import { useState } from "react";
import { CartItem } from "./CartDrawer";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
}

export function CheckoutModal({ open, onClose, items, total }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "yape" | "plin" | "paypal">("card");
  const [discountCode, setDiscountCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    alert("¡Pago procesado exitosamente! Gracias por tu compra.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>Finalizar Compra</DialogTitle>
          <DialogDescription className="sr-only">
            Ingresa tus datos de pago y dirección de envío para completar tu compra
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <h3 className="mb-4">Método de Pago</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === "card"
                    ? "border-[#b8a89a] bg-[#b8a89a]/10"
                    : "border-border hover:border-[#b8a89a]/50"
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span>Tarjeta</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod("yape")}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === "yape"
                    ? "border-[#b8a89a] bg-[#b8a89a]/10"
                    : "border-border hover:border-[#b8a89a]/50"
                }`}
              >
                <Smartphone className="w-6 h-6" />
                <span>Yape</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod("plin")}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === "plin"
                    ? "border-[#b8a89a] bg-[#b8a89a]/10"
                    : "border-border hover:border-[#b8a89a]/50"
                }`}
              >
                <Smartphone className="w-6 h-6" />
                <span>Plin</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === "paypal"
                    ? "border-[#b8a89a] bg-[#b8a89a]/10"
                    : "border-border hover:border-[#b8a89a]/50"
                }`}
              >
                <DollarSign className="w-6 h-6" />
                <span>PayPal</span>
              </button>
            </div>
          </div>

          <Separator />

          {/* Shipping Information */}
          <div>
            <h3 className="mb-4">Información de Envío</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" placeholder="Tu nombre" required />
              </div>
              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" placeholder="Tu apellido" required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" placeholder="Calle, número, etc." required />
              </div>
              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" placeholder="Ciudad" required />
              </div>
              <div>
                <Label htmlFor="zipCode">Código Postal</Label>
                <Input id="zipCode" placeholder="12345" required />
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          {paymentMethod === "card" && (
            <div>
              <h3 className="mb-4">Detalles de Pago</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Fecha de Vencimiento</Label>
                    <Input id="expiry" placeholder="MM/AA" required />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" required />
                  </div>
                </div>
              </div>
            </div>
          )}

          {(paymentMethod === "yape" || paymentMethod === "plin") && (
            <div className="bg-muted p-6 rounded-xl text-center">
              <p className="mb-4">
                Escanea el código QR desde tu app de {paymentMethod === "yape" ? "Yape" : "Plin"}
              </p>
              <div className="w-48 h-48 bg-card mx-auto rounded-xl flex items-center justify-center border-2">
                <p className="text-muted-foreground">QR Code</p>
              </div>
              <p className="mt-4">Monto a pagar: S/ {total.toFixed(2)}</p>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="bg-muted p-6 rounded-xl text-center">
              <p className="mb-4">Serás redirigido a PayPal para completar el pago</p>
              <Button type="button" className="bg-[#0070ba] hover:bg-[#003087]">
                Continuar con PayPal
              </Button>
            </div>
          )}

          <Separator />

          {/* Discount Code */}
          <div>
            <Label htmlFor="discount">Código de Descuento</Label>
            <div className="flex gap-2">
              <Input
                id="discount"
                placeholder="Ingresa tu código"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <Button type="button" variant="outline">
                Aplicar
              </Button>
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="bg-muted p-6 rounded-xl space-y-3">
            <h3 className="mb-4">Resumen del Pedido</h3>
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.name} x{item.quantity}
                </span>
                <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between">
              <span>Total a Pagar</span>
              <span className="">S/ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#b8a89a] hover:bg-[#a89888] rounded-full"
            >
              Pagar Ahora
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
