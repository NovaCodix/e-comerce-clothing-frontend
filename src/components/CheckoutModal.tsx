import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { CreditCard, Smartphone, DollarSign, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { CartItem } from "./CartDrawer";
import { toast } from "sonner";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onAuthRequired: () => void;
  onCheckoutSuccess: () => void; // Para limpiar el carrito
}

export function CheckoutModal({ open, onClose, items, total, onAuthRequired, onCheckoutSuccess }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"yape" | "account">("yape");
  const [discountCode, setDiscountCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [wantsDelivery, setWantsDelivery] = useState(true);
  
  const DELIVERY_COST = 10;
  const finalTotal = wantsDelivery ? total + DELIVERY_COST : total;
  
  // Datos del cliente
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    reference: ""
  });

  const storeAccount = {
    bank: "BCP",
    accountNumber: "123-4567890-12",
    interbank: "00123456789012345678",
    holder: "Tienda Ejemplo S.A.",
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copiado al portapapeles");
    } catch (err) {
      console.error(err);
      toast.error("Error al copiar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!customerData.name || !customerData.phone) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (wantsDelivery && !customerData.address) {
      toast.error("Por favor ingresa tu dirección de envío");
      return;
    }

    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    setIsProcessing(true);

    try {
      // Validar que todos los items tengan variantId
      const invalidItems = items.filter(item => !item.variantId);
      if (invalidItems.length > 0) {
        toast.error("Error: Algunos productos no tienen variante asignada. Por favor, vuelve a agregarlos al carrito.");
        setIsProcessing(false);
        return;
      }

      // Preparar datos para el checkout
      const checkoutData = {
        customerName: customerData.name,
        customerEmail: customerData.email || undefined,
        customerPhone: customerData.phone,
        shippingAddress: wantsDelivery ? JSON.stringify({
          address: customerData.address,
          district: customerData.district,
          reference: customerData.reference
        }) : "Recojo en tienda",
        deliveryCost: wantsDelivery ? DELIVERY_COST : 0,
        wantsDelivery: wantsDelivery,
        items: items.map(item => ({
          productId: String(item.id), // El item YA ES el producto
          variantId: item.variantId!,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor || "Sin especificar"
        })),
        paymentMethod: "MANUAL"
      };

      console.log('📤 Enviando datos de checkout:', checkoutData);

      // Llamar al endpoint de checkout
      const response = await fetch('http://localhost:4000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.type === 'INSUFFICIENT_STOCK') {
          toast.error(data.error, {
            duration: 5000,
            description: "Por favor actualiza tu carrito"
          });
        } else {
          toast.error(data.error || "Error al procesar la orden");
        }
        return;
      }

      // Éxito: Orden creada
      toast.success("¡Orden creada exitosamente!", {
        description: `Número de orden: ${data.order.orderNumber}`
      });

      // Limpiar el carrito
      onCheckoutSuccess();

      // Cerrar el modal
      onClose();

      // Preparar mensaje de WhatsApp
      const whatsappMessage = `¡Hola! He realizado un pedido en su tienda.\n\n` +
        `📦 *Orden #${data.order.orderNumber}*\n` +
        `💰 Total: S/ ${data.order.total}\n` +
        `📱 Cliente: ${customerData.name}\n\n` +
        `Voy a realizar el pago por ${paymentMethod === 'yape' ? 'Yape' : 'transferencia bancaria'}. ` +
        `¿Me pueden confirmar la recepción de mi pedido?`;

      // Redirigir a WhatsApp
      const whatsappNumber = "51999999999"; // Reemplaza con tu número
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Pequeña pausa para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);

    } catch (error) {
      console.error('Error en checkout:', error);
      toast.error("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1a1a1a] p-6 sm:p-8">
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

          {/* Datos del Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datos del Cliente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="mb-2">Nombre Completo *</Label>
                <Input
                  id="name"
                  required
                  placeholder="Ej: Juan Pérez"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="mb-2">Teléfono / WhatsApp *</Label>
                <Input
                  id="phone"
                  required
                  placeholder="Ej: 999 888 777"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  className="h-12"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="mb-2">Email (Opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={customerData.email}
                onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                className="h-12"
              />
            </div>

            {/* Opción de Delivery */}
            <div className="bg-gray-50 dark:bg-[#252525] p-6 rounded-xl border">
              <div className="flex items-start gap-5">
                <input
                  type="checkbox"
                  id="delivery"
                  checked={wantsDelivery}
                  onChange={(e) => setWantsDelivery(e.target.checked)}
                  className="w-6 h-6 mt-0.5 cursor-pointer accent-primary"
                />
                <div className="flex-1">
                  <Label htmlFor="delivery" className="text-base font-semibold cursor-pointer block mb-2">
                    🚚 Quiero delivery a domicilio (+S/ {DELIVERY_COST.toFixed(2)})
                  </Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {wantsDelivery 
                      ? "Entregaremos tu pedido en la dirección indicada" 
                      : "Recogerás tu pedido en nuestra tienda"}
                  </p>
                </div>
              </div>
            </div>

            {wantsDelivery && (
              <>
                <div>
                  <Label htmlFor="address" className="mb-2">Dirección de Envío *</Label>
                  <Input
                    id="address"
                    required
                    placeholder="Ej: Av. Principal 123, Dpto 201"
                    value={customerData.address}
                    onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="district" className="mb-2">Distrito</Label>
                    <Input
                      id="district"
                      placeholder="Ej: Miraflores"
                      value={customerData.district}
                      onChange={(e) => setCustomerData({...customerData, district: e.target.value})}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reference" className="mb-2">Referencia</Label>
                    <Input
                      id="reference"
                      placeholder="Ej: Cerca al parque"
                      value={customerData.reference}
                      onChange={(e) => setCustomerData({...customerData, reference: e.target.value})}
                      className="h-12"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Payment Details: mostrar sólo Yape (QR) y Cuenta de la tienda. */}

          {paymentMethod === "yape" && (
            <div className="bg-gray-50 dark:bg-[#252525] p-6 rounded-xl text-center border border-white/20 dark:border-[#18303a]">
              <p className="mb-3">Escanea este QR con Yape para pagar</p>
              <div className="w-56 h-56 bg-white/95 dark:bg-[#071522] mx-auto rounded-xl flex items-center justify-center border border-white/20 dark:border-[#18303a] shadow-sm">
                {/* Ideal: reemplazar por imagen de QR real: <img src="/path/to/yape-qr.png" className="w-full h-full object-contain rounded-md" /> */}
                <div className="text-muted-foreground">QR Code (placeholder)</div>
              </div>
              <p className="mt-4">Monto a pagar: <strong>S/ {finalTotal.toFixed(2)}</strong></p>
              <div className="flex justify-center gap-2 mt-3">
                <Button type="button" variant="outline" onClick={() => copyToClipboard(finalTotal.toFixed(2))}>
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
                    <div className="font-medium">S/ {finalTotal.toFixed(2)}</div>
                    <Button type="button" variant="outline" onClick={() => copyToClipboard(finalTotal.toFixed(2))}>
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
          <div className="bg-gray-50 dark:bg-[#252525] p-6 rounded-xl space-y-3">
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
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            {wantsDelivery && (
              <div className="flex justify-between text-muted-foreground">
                <span>🚚 Delivery</span>
                <span>S/ {DELIVERY_COST.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total a Pagar</span>
              <span className="">S/ {finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#b8a89a] hover:bg-[#a89888] rounded-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Finalizar Compra'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
