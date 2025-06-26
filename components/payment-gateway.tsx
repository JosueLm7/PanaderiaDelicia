"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface PaymentGatewayProps {
  onOrderComplete: (orderNumber: string) => void
  onBackToCart: () => void
}

export default function PaymentGateway({ onOrderComplete, onBackToCart }: PaymentGatewayProps) {
  const { user } = useAuth()
  const { items, total, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("tarjeta")
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState({
    numero: "",
    fecha: "",
    cvv: "",
    nombre: "",
  })

  const shipping = 5.0
  const finalTotal = total + shipping

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "numero") {
      // Formatear número de tarjeta
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .trim()
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19)
    } else if (name === "fecha") {
      // Formatear fecha MM/YY
      formattedValue = value.replace(/\D/g, "")
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4)
      }
    } else if (name === "cvv") {
      // Solo números, máximo 3 dígitos
      formattedValue = value.replace(/\D/g, "").slice(0, 3)
    }

    setCardData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))
  }

  const handleFinalizePurchase = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para completar la compra")
      return
    }

    if (items.length === 0) {
      toast.error("Tu carrito está vacío")
      return
    }

    // Validar método de pago
    if (paymentMethod === "tarjeta") {
      const requiredFields = ["numero", "fecha", "cvv", "nombre"]
      const missingFields = requiredFields.filter((field) => !cardData[field as keyof typeof cardData])

      if (missingFields.length > 0) {
        toast.error("Por favor, completa todos los datos de la tarjeta")
        return
      }
    }

    setLoading(true)

    try {
      // Obtener datos del formulario de pedido
      const orderFormData = JSON.parse(localStorage.getItem("orderFormData") || "{}")

      const orderData = {
        user_id: user.id,
        customer_name: orderFormData.nombre,
        customer_phone: orderFormData.telefono,
        customer_email: orderFormData.email,
        delivery_address: orderFormData.direccion,
        delivery_date: orderFormData.fechaEntrega,
        delivery_time: orderFormData.horaEntrega,
        notes: orderFormData.notas,
        payment_method: paymentMethod,
        items: items,
        subtotal: total,
        shipping: shipping,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        clearCart()
        localStorage.removeItem("orderFormData")
        onOrderComplete(result.order.order_number)
        toast.success("¡Pedido realizado con éxito!")
      } else {
        throw new Error(result.error || "Error al procesar el pedido")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("Error al procesar el pedido. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Resumen del Pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de tu Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>S/{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>S/{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío:</span>
              <span>S/{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>S/{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métodos de Pago */}
      <Card>
        <CardHeader>
          <CardTitle>Método de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tarjeta">Tarjeta</TabsTrigger>
              <TabsTrigger value="transferencia">Transferencia</TabsTrigger>
              <TabsTrigger value="efectivo">Efectivo</TabsTrigger>
            </TabsList>

            <TabsContent value="tarjeta" className="space-y-4">
              <div>
                <Label htmlFor="numero">Número de Tarjeta</Label>
                <Input
                  id="numero"
                  name="numero"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.numero}
                  onChange={handleCardInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha">Fecha de Expiración</Label>
                  <Input
                    id="fecha"
                    name="fecha"
                    placeholder="MM/YY"
                    value={cardData.fecha}
                    onChange={handleCardInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" name="cvv" placeholder="123" value={cardData.cvv} onChange={handleCardInputChange} />
                </div>
              </div>

              <div>
                <Label htmlFor="nombre">Nombre en la Tarjeta</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="JUAN PEREZ"
                  value={cardData.nombre}
                  onChange={handleCardInputChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="transferencia" className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Datos para Transferencia</h4>
                <p>
                  <strong>Banco:</strong> Banco de Crédito del Perú
                </p>
                <p>
                  <strong>Cuenta:</strong> 123-456789-0-12
                </p>
                <p>
                  <strong>Titular:</strong> Panadería Delicia S.A.C.
                </p>
                <p>
                  <strong>RUC:</strong> 20123456789
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Una vez realizada la transferencia, envíanos el comprobante a nuestro WhatsApp.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="efectivo" className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Pago en Efectivo</h4>
                <p>Podrás pagar en efectivo al momento de la entrega.</p>
                <p className="text-sm text-gray-600 mt-2">
                  Por favor, asegúrate de tener el monto exacto para facilitar la entrega.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={onBackToCart}>
              Volver al Carrito
            </Button>
            <Button onClick={handleFinalizePurchase} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? "Procesando..." : "Finalizar Compra"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
