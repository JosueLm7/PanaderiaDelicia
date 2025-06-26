"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User } from "lucide-react"

interface HeaderProps {
  itemCount: number
  onCartClick: () => void
  onLoginClick: () => void
}

export default function Header({ itemCount, onCartClick, onLoginClick }: HeaderProps) {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-black/70 text-white sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panadería Delicia</h1>

          <div className="flex items-center gap-6">
            <a href="#inicio" className="hover:text-orange-300 transition-colors">
              Inicio
            </a>
            <a href="#productos" className="hover:text-orange-300 transition-colors">
              Productos
            </a>
            <a href="#explore" className="hover:text-orange-300 transition-colors">
              Nosotros
            </a>
            <a href="#pedidos" className="hover:text-orange-300 transition-colors">
              Pedidos
            </a>

            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              className="text-white hover:text-orange-300 hover:bg-white/10"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {itemCount}
              </span>
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">Hola, {user.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-white hover:text-orange-300 hover:bg-white/10"
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoginClick}
                className="text-white hover:text-orange-300 hover:bg-white/10"
              >
                <User className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
