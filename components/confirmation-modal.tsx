"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  orderNumber: string
}

export default function ConfirmationModal({ isOpen, onClose, orderNumber }: ConfirmationModalProps) {
  const handleClose = () => {
    onClose()
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <DialogTitle className="text-2xl">¡Pedido Confirmado!</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">Tu pedido ha sido procesado correctamente.</p>
          <p>
            <strong>Número de pedido:</strong> <span className="text-orange-600 font-bold">{orderNumber}</span>
          </p>
          <p className="text-sm text-gray-500">Recibirás un correo electrónico con los detalles de tu compra.</p>
          <p className="text-lg font-semibold text-orange-600">¡Gracias por confiar en Panadería Delicia!</p>

          <Button onClick={handleClose} className="w-full bg-orange-600 hover:bg-orange-700">
            Volver al Inicio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
