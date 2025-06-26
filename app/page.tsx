"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import Header from "@/components/header"
import ProductGrid from "@/components/product-grid"
import Cart from "@/components/cart"
import OrderForm from "@/components/order-form"
import PaymentGateway from "@/components/payment-gateway"
import LoginModal from "@/components/login-modal"
import ConfirmationModal from "@/components/confirmation-modal"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  category: string
  image_url: string | null
  active: boolean
  created_at: string
}

export default function Home() {
  const { user } = useAuth()
  const { items, itemCount } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [currentStep, setCurrentStep] = useState<"cart" | "order" | "payment">("cart")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) => selectedCategory === "todos" || product.category === selectedCategory,
  )

  const categories = [
    { id: "todos", name: "Todos" },
    { id: "pan", name: "Panes" },
    { id: "pizzas", name: "Pizzas" },
    { id: "piononos", name: "Piononos" },
    { id: "tortas", name: "Tortas" },
    { id: "pye", name: "Pie" },
    { id: "bizcochos", name: "Bizcochos" },
  ]

  const handleProceedToOrder = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    setCurrentStep("order")
  }

  const handleProceedToPayment = () => {
    setCurrentStep("payment")
  }

  const handleOrderComplete = (orderNum: string) => {
    setOrderNumber(orderNum)
    setShowConfirmationModal(true)
    setCurrentStep("cart")
  }

  const handleBackToCart = () => {
    setCurrentStep("cart")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-lg">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Header
        itemCount={itemCount}
        onCartClick={() => setCurrentStep("cart")}
        onLoginClick={() => setShowLoginModal(true)}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-4">Sweet Treats, Perfect Eats</h2>
          <p className="text-xl mb-8">Delicias horneadas con amor cada día</p>
          <Button
            size="lg"
            className="bg-white text-orange-600 hover:bg-orange-50"
            onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}
          >
            Ver productos
          </Button>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Top Productos</h2>
          <ProductGrid products={products.slice(4, 7)} />
        </div>
      </section>

      {/* Promo Section */}
      <section className="bg-orange-100 py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">20% de descuento en tu primer pedido</h2>
          <p className="text-lg mb-8">¡Aprovecha nuestra promoción especial!</p>
          <Button size="lg" onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}>
            Pedir ahora
          </Button>
        </div>
      </section>

      {/* Explore Section */}
      <section id="explore" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Escoge</h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-orange-600 hover:bg-orange-700" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <ProductGrid products={filteredProducts} />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Sobre Nosotros</h2>
          <p className="text-lg text-gray-600">
            Panadería familiar con recetas tradicionales y pasión por el pan y la pastelería.
          </p>
        </div>
      </section>

      {/* Order Section */}
      <section id="pedidos" className="py-16 px-4 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Haz tu Pedido</h2>

          {currentStep === "cart" && <Cart onProceedToOrder={handleProceedToOrder} />}

          {currentStep === "order" && (
            <OrderForm onProceedToPayment={handleProceedToPayment} onBackToCart={handleBackToCart} />
          )}

          {currentStep === "payment" && (
            <PaymentGateway onOrderComplete={handleOrderComplete} onBackToCart={handleBackToCart} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
              <p className="mb-2">📞 987 654 321</p>
              <p>📧 panaderiadelicia@gmail.com</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Redes</h3>
              <p>Facebook · Instagram · WhatsApp</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Explora</h3>
              <p>Inicio · Productos · Nosotros · Pedidos</p>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-700">
            <p>&copy; 2025 Panadería Delicia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        orderNumber={orderNumber}
      />
    </div>
  )
}
