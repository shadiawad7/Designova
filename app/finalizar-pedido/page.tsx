"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Lock, CreditCard } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function FinalizarPedidoPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const [contactForm, setContactForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  })

  const [shippingForm, setShippingForm] = useState({
    direccion: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    notas: "",
  })

  const [paymentForm, setPaymentForm] = useState({
    nombreTarjeta: "",
    numeroTarjeta: "",
    fechaVencimiento: "",
    cvv: "",
    notasAdicionales: "",
  })

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value })
  }

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value })
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setIsComplete(true)
    clearCart()
  }

  if (isComplete) {
    return (
      <div className="bg-cream min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a1a]">
            ¡Pedido completado!
          </h1>
          <p className="text-muted-foreground mb-8">
            Gracias por tu compra. Te enviaremos un email con los detalles de tu pedido.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors"
          >
            Volver al inicio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-cream min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a]">
            Finalizar pedido
          </h1>
          <p className="text-muted-foreground mb-8">Tu carrito está vacío</p>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors"
          >
            Ir a la tienda <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a]">
            Finalizar pedido
          </h1>
          <p className="text-muted-foreground">
            Solo falta un paso para completar tu compra
          </p>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Forms Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-6 text-[#1a1a1a]">
                    Información de contacto
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={contactForm.nombre}
                        onChange={handleContactChange}
                        placeholder="Juan"
                        required
                        className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label htmlFor="apellido" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Apellido
                      </label>
                      <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={contactForm.apellido}
                        onChange={handleContactChange}
                        placeholder="García"
                        required
                        className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="email" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="tu@email.com"
                      required
                      className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="telefono" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={contactForm.telefono}
                      onChange={handleContactChange}
                      placeholder="+34-600123456"
                      required
                      className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-6 text-[#1a1a1a]">
                    Dirección de envío
                  </h2>
                  <div>
                    <label htmlFor="direccion" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={shippingForm.direccion}
                      onChange={handleShippingChange}
                      placeholder="Calle principal 123"
                      required
                      className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label htmlFor="ciudad" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        value={shippingForm.ciudad}
                        onChange={handleShippingChange}
                        placeholder="tu@email.com"
                        required
                        className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label htmlFor="provincia" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Provincia
                      </label>
                      <input
                        type="text"
                        id="provincia"
                        name="provincia"
                        value={shippingForm.provincia}
                        onChange={handleShippingChange}
                        placeholder="valencia"
                        required
                        className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label htmlFor="codigoPostal" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Código postal
                      </label>
                      <input
                        type="text"
                        id="codigoPostal"
                        name="codigoPostal"
                        value={shippingForm.codigoPostal}
                        onChange={handleShippingChange}
                        placeholder="28001"
                        required
                        className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="notas" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Notas adicionales (opcional)
                    </label>
                    <textarea
                      id="notas"
                      name="notas"
                      value={shippingForm.notas}
                      onChange={handleShippingChange}
                      placeholder="Instrucciones especiales para el diseño o entrega..."
                      rows={3}
                      className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground resize-none"
                    />
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#1a1a1a]">
                      Información de Pago- TARJETA
                    </h2>
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VISA</span>
                      </div>
                      <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">MC</span>
                      </div>
                      <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AMEX</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombreTarjeta" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Nombre en la tarjeta
                      </label>
                      <input
                        type="text"
                        id="nombreTarjeta"
                        name="nombreTarjeta"
                        value={paymentForm.nombreTarjeta}
                        onChange={handlePaymentChange}
                        placeholder="Juan García"
                        required
                        className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label htmlFor="numeroTarjeta" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        id="numeroTarjeta"
                        name="numeroTarjeta"
                        value={paymentForm.numeroTarjeta}
                        onChange={handlePaymentChange}
                        placeholder="1234567891234567"
                        required
                        className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Fecha de vencimiento
                      </label>
                      <input
                        type="text"
                        id="fechaVencimiento"
                        name="fechaVencimiento"
                        value={paymentForm.fechaVencimiento}
                        onChange={handlePaymentChange}
                        placeholder="MM/AA"
                        required
                        className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={paymentForm.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        required
                        className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="notasAdicionales" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Notas adicionales (opcional)
                    </label>
                    <textarea
                      id="notasAdicionales"
                      name="notasAdicionales"
                      value={paymentForm.notasAdicionales}
                      onChange={handlePaymentChange}
                      rows={2}
                      className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground resize-none"
                    />
                  </div>
                  <div className="mt-4 p-4 bg-gold/20 rounded-lg flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gold" />
                    <p className="text-sm text-[#1a1a1a]">
                      Tu información de pago está segura. Utilizamos encriptación SSL para proteger tus datos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6 text-[#1a1a1a]">
                    Resumen del pedido
                  </h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-[#1a1a1a]">
                      <span>Subtotal</span>
                      <span>{totalPrice} €</span>
                    </div>
                    <div className="flex justify-between text-[#1a1a1a]">
                      <span>Envío</span>
                      <span>Gratis</span>
                    </div>
                    <p className="text-xs text-muted-foreground">*IVA incluido</p>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between font-bold text-lg text-[#1a1a1a]">
                        <span>Total</span>
                        <span>{totalPrice} €</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-50 mb-3"
                  >
                    <CreditCard className="w-4 h-4" />
                    {isProcessing ? "Procesando..." : "Pagar"}
                    {!isProcessing && <ArrowRight className="w-4 h-4" />}
                  </button>

                  <p className="text-xs text-muted-foreground text-center mb-4">
                    *Al finalizar el pedido aceptas los Términos y Condiciones y la Política de Privacidad
                  </p>

                  <Link
                    href="/carrito"
                    className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-gold-light text-white hover:text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors"
                  >
                    Modificar carrito <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
