import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { CreditCard, Smartphone, DollarSign, Copy } from "lucide-react";
import { useState } from "react";
import { CartItem } from "./CartDrawer";
import { useAuthContext } from "../contexts/AuthContext";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onAuthRequired: () => void;
}

export function CheckoutModal({ open, onClose, items, total, onAuthRequired }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"yape" | "account">("yape");
  const [discountCode, setDiscountCode] = useState("");
  // Guest checkout: do not require authentication for now
  // const { user } = useAuthContext();
  // Antes: si el modal se abría sin usuario, se redirigía al flujo de auth.
  // Para la primera versión permitimos pagar sin iniciar sesión, por lo que
  // esta verificación queda deshabilitada temporalmente.

  const storeAccount = {
    bank: "BCP",
    accountNumber: "123-4567890-12",
    interbank: "00123456789012345678",
    holder: "Tienda Ejemplo S.A.",
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // UX: mostrar una pequeña confirmación (esto es mínimo — se puede mejorar con toasts)
      alert("Copiado al portapapeles");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    alert("¡Pago procesado exitosamente! Gracias por tu compra.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle>Finalizar Compra</DialogTitle>
          <DialogDescription className="sr-only">
            Ingresa tus datos de pago y dirección de envío para completar tu compra
          </DialogDescription>
        </DialogHeader>

  <form onSubmit={handleSubmit} className="space-y-8">
          {/* Payment Method Selection */}
          <div>
            <h3 className="mb-4">Método de Pago</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setPaymentMethod("yape")}
                className={`p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left shadow-sm ${
                  paymentMethod === "yape"
                    ? "border-[#b8a89a] bg-[#b8a89a]/8"
                    : "border-white/20 dark:border-border hover:border-[#b8a89a]/40 bg-transparent"
                }`}
              >
                <div className="p-4 rounded-lg bg-card/40 dark:bg-card/20">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-medium">Yape (QR)</div>
                  <div className="text-sm text-muted-foreground">Escanea el QR con la app Yape para pagar rápidamente</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("account")}
                className={`p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left shadow-sm ${
                  paymentMethod === "account"
                    ? "border-[#b8a89a] bg-[#b8a89a]/8"
                    : "border-white/20 dark:border-border hover:border-[#b8a89a]/40 bg-transparent"
                }`}
              >
                <div className="p-4 rounded-lg bg-card/40 dark:bg-card/20">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-medium">Transferencia / Depósito</div>
                  <div className="text-sm text-muted-foreground">Paga transfiriendo al número de cuenta de la tienda</div>
                </div>
              </button>

              {/*
                Código comentado: anteriores métodos (Tarjeta, Plin, PayPal) — dejado como referencia
                para reactivación futura. Mantener aquí para que sea fácil copiar/pegar.

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                ... (Tarjeta, Plin, PayPal buttons) ...
              </div>
              */}
            </div>
          </div>

          <Separator />

          {/* Shipping Information */}
          <div>
            <h3 className="mb-4">Información de Envío</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="mb-3">Nombre</Label>
                  <Input id="firstName" placeholder="Tu nombre" required className="h-12 px-4 bg-white/95 dark:bg-[#071522] text-foreground placeholder:text-muted-foreground shadow-sm border border-white/20 dark:border-[#18303a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b8a89a]/40" />
              </div>
              <div>
                <Label htmlFor="lastName" className="mb-3">Apellido</Label>
                  <Input id="lastName" placeholder="Tu apellido" required className="h-12 px-4 bg-white/95 dark:bg-[#071522] text-foreground placeholder:text-muted-foreground shadow-sm border border-white/20 dark:border-[#18303a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b8a89a]/40" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email" className="mb-3">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" required className="h-12 px-4 bg-white/95 dark:bg-[#071522] text-foreground placeholder:text-muted-foreground shadow-sm border border-white/20 dark:border-[#18303a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b8a89a]/40" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="mb-3">Dirección</Label>
                  <Input id="address" placeholder="Calle, número, etc." required className="h-12 px-4 bg-white/95 dark:bg-[#071522] text-foreground placeholder:text-muted-foreground shadow-sm border border-white/20 dark:border-[#18303a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b8a89a]/40" />
              </div>
              <div>
                <Label htmlFor="city" className="mb-3">Ciudad</Label>
                  <Input id="city" placeholder="Ciudad" required className="h-12 px-4 bg-white/95 dark:bg-[#071522] text-foreground placeholder:text-muted-foreground shadow-sm border border-white/20 dark:border-[#18303a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b8a89a]/40" />
              </div>
              <div>
                <Label htmlFor="zipCode" className="mb-3">Código Postal</Label>
                  <Input id="zipCode" placeholder="12345" required className="h-12 px-4 bg-white/95 dark:bg-[#071522] text-foreground placeholder:text-muted-foreground shadow-sm border border-white/20 dark:border-[#18303a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b8a89a]/40" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Details: mostrar sólo Yape (QR) y Cuenta de la tienda. Mantuvimos el código
              original comentado arriba para reactivar métodos en el futuro. */}

          {paymentMethod === "yape" && (
            <div className="bg-muted p-6 rounded-xl text-center border border-white/20 dark:border-[#18303a]">
              <p className="mb-3">Escanea este QR con Yape para pagar</p>
              <div className="w-56 h-56 bg-white/95 dark:bg-[#071522] mx-auto rounded-xl flex items-center justify-center border border-white/20 dark:border-[#18303a] shadow-sm">
                {/* Ideal: reemplazar por imagen de QR real: <img src="/path/to/yape-qr.png" className="w-full h-full object-contain rounded-md" /> */}
                <div className="text-muted-foreground">QR Code (placeholder)</div>
              </div>
              <p className="mt-4">Monto a pagar: <strong>S/ {total.toFixed(2)}</strong></p>
              <div className="flex justify-center gap-2 mt-3">
                <Button type="button" variant="outline" onClick={() => copyToClipboard(total.toFixed(2))}>
                  <Copy className="mr-2 w-4 h-4" /> Copiar monto
                </Button>
                <Button type="button" onClick={() => alert('Abre la app Yape y escanea el QR')}>¿Cómo pago?</Button>
              </div>
            </div>
          )}

          {paymentMethod === "account" && (
            <div className="bg-white/95 dark:bg-[#061219] p-6 rounded-xl shadow-sm border border-white/20 dark:border-[#18303a]">
              <h4 className="mb-3">Datos de la cuenta</h4>
              <div className="grid gap-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Banco</div>
                    <div className="font-medium">{storeAccount.bank}</div>
                  </div>
                  <Button type="button" variant="ghost" onClick={() => copyToClipboard(storeAccount.bank)}>
                    <Copy className="w-4 h-4 mr-2" /> Copiar
                  </Button>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Número de cuenta</div>
                    <div className="font-medium">{storeAccount.accountNumber}</div>
                  </div>
                  <Button type="button" variant="ghost" onClick={() => copyToClipboard(storeAccount.accountNumber)}>
                    <Copy className="w-4 h-4 mr-2" /> Copiar
                  </Button>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Interbank</div>
                    <div className="font-medium">{storeAccount.interbank}</div>
                  </div>
                  <Button type="button" variant="ghost" onClick={() => copyToClipboard(storeAccount.interbank)}>
                    <Copy className="w-4 h-4 mr-2" /> Copiar
                  </Button>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Titular</div>
                  <div className="font-medium">{storeAccount.holder}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Monto a transferir</div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="font-medium">S/ {total.toFixed(2)}</div>
                    <Button type="button" variant="outline" onClick={() => copyToClipboard(total.toFixed(2))}>
                      <Copy className="w-4 h-4 mr-2" /> Copiar monto
                    </Button>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Después de realizar la transferencia, envíanos el comprobante para que podamos validar y despachar tu pedido.</p>
            </div>
          )}

          <Separator />

          {/* Discount Code */}
          <div>
            <Label htmlFor="discount" className="mb-3">Código de Descuento</Label>
            <div className="flex gap-2">
              <Input
                id="discount"
                placeholder="Ingresa tu código"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="h-12 px-4 bg-white/95 dark:bg-[#071522] text-foreground placeholder:text-muted-foreground shadow-sm border border-white/20 dark:border-[#18303a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b8a89a]/40"
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
