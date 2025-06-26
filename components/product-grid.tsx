"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  category: string
  image_url: string | null
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCart()

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || undefined,
    })
    toast.success(`${product.name} agregado al carrito`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square relative">
            <Image
              src={product.image_url || "/placeholder.svg?height=200&width=200"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            {product.description && <p className="text-gray-600 text-sm mb-2">{product.description}</p>}
            <p className="text-xl font-bold text-orange-600">S/{product.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button onClick={() => handleAddToCart(product)} className="w-full bg-orange-600 hover:bg-orange-700">
              Agregar al Carrito
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
