"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface OrderFormProps {
  onProceedToPayment: () => void
  onBackToCart: () => void
}

export default function OrderForm({ onProceedToPayment, onBackToCart }: OrderFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: user?.email || "",
    direccion: "",
    fechaEntrega: "",
    horaEntrega: "",
    notas: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos requeridos
    const requiredFields = ["nombre", "telefono", "email", "direccion", "fechaEntrega", "horaEntrega"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      toast.error("Por favor, completa todos los campos requeridos")
      return
    }

    // Guardar datos del formulario en localStorage para usar en el pago
    localStorage.setItem("orderFormData", JSON.stringify(formData))
    onProceedToPayment()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Contacto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Correo electrónico *</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="direccion">Dirección de entrega *</Label>
            <Textarea id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fechaEntrega">Fecha de entrega *</Label>
              <Input
                id="fechaEntrega"
                name="fechaEntrega"
                type="date"
                value={formData.fechaEntrega}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="horaEntrega">Hora de entrega *</Label>
              <Input
                id="horaEntrega"
                name="horaEntrega"
                type="time"
                value={formData.horaEntrega}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notas">Notas adicionales</Label>
            <Textarea
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              placeholder="Instrucciones especiales para la entrega..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBackToCart}>
              Volver al Carrito
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              Continuar al Pago
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
