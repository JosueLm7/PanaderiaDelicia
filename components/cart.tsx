"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface CartProps {
  onProceedToOrder: () => void
}

export default function Cart({ onProceedToOrder }: CartProps) {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart()

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
          <p className="text-gray-400 mt-2">Agrega algunos productos para comenzar</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Tu Carrito de Compras</span>
          <Button variant="outline" onClick={clearCart} size="sm">
            Vaciar Carrito
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-16 h-16 relative">
              <Image
                src={item.image_url || "/placeholder.svg?height=64&width=64"}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>

            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-orange-600 font-bold">S/{item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-right">
              <p className="font-bold">S/{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total: S/{total.toFixed(2)}</span>
            <Button onClick={onProceedToOrder} size="lg" className="bg-orange-600 hover:bg-orange-700">
              Proceder al Pedido
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
