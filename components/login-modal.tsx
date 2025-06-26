"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn, signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signIn(loginData.email, loginData.password)

      if (error) {
        toast.error("Error al iniciar sesión: " + error.message)
      } else {
        toast.success("¡Bienvenido de vuelta!")
        onClose()
      }
    } catch (error) {
      toast.error("Error inesperado al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp(registerData.email, registerData.password, registerData.fullName)

      if (error) {
        toast.error("Error al registrarse: " + error.message)
      } else {
        toast.success("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.")
        onClose()
      }
    } catch (error) {
      toast.error("Error inesperado al registrarse")
    } finally {
      setLoading(false)
    }
  }

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Acceso a tu cuenta</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Correo electrónico</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleLoginInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="login-password">Contraseña</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginInputChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-fullName">Nombre completo</Label>
                <Input
                  id="register-fullName"
                  name="fullName"
                  value={registerData.fullName}
                  onChange={handleRegisterInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-email">Correo electrónico</Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  value={registerData.email}
                  onChange={handleRegisterInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-phone">Teléfono</Label>
                <Input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  value={registerData.phone}
                  onChange={handleRegisterInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-password">Contraseña</Label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  value={registerData.password}
                  onChange={handleRegisterInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="register-confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterInputChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
