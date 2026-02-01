"use client"

import React from "react"

import { useState } from "react"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    label: "+34-600123456",
    href: "tel:+34600123456",
  },
  {
    icon: Mail,
    label: "designova.studio01@gmail.com",
    href: "mailto:designova.studio01@gmail.com",
  },
  {
    icon: MapPin,
    label: "Calle del diseño 10, valencia",
    href: "#",
  },
]

const consultaOptions = [
  "Selecciona tipo de consulta",
  "Invitaciones para eventos",
  "Grabado láser",
  "Diseño gráfico",
  "Presupuesto personalizado",
  "Otro",
]

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipoConsulta: "",
    mensaje: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCompleto: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          tipoConsulta: formData.tipoConsulta,
          mensaje: formData.mensaje,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Error al enviar el mensaje")
      }

      setIsSubmitted(true)
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        tipoConsulta: "",
        mensaje: "",
      })
    } catch (error) {
      console.error("Submit failed:", error)
      alert("No se pudo enviar el mensaje. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Header Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a]">
            Nos encantaría escucharte
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes una pregunta? ¿Una idea para un proyecto? ¿O simplemente quieres charlar sobre diseño? 
            Estamos aquí para ti.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#1a1a1a]">
            Contactanos
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.href}
                className="bg-cream-dark rounded-full py-4 px-6 flex items-center justify-center gap-3 hover:bg-gold/20 transition-colors"
              >
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0">
                  <info.icon className="w-5 h-5 text-[#1a1a1a]" />
                </div>
                <span className="text-[#1a1a1a] text-sm">{info.label}</span>
              </a>
            ))}
          </div>

          {/* Business Hours */}
          <div className="flex justify-center mb-12">
            <div className="bg-[#1a1a1a] text-white rounded-2xl py-4 px-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Horario de Atención</span>
              </div>
              <div className="text-sm text-white/80 space-y-1">
                <p>Lunes - Viernes: 09:00 - 18:00</p>
                <p>Sábado: 10:00 - 14:00</p>
                <p>Domingo: Cerrado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-[#1a1a1a]">Envíanos un mensaje</h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">¡Mensaje enviado!</h3>
                <p className="text-muted-foreground">Te responderemos lo antes posible.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-gold hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre completo"
                    required
                    className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                      className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+34-600123456"
                      className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="tipoConsulta" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Tipo de consulta
                  </label>
                  <select
                    id="tipoConsulta"
                    name="tipoConsulta"
                    value={formData.tipoConsulta}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a]"
                  >
                    {consultaOptions.map((option) => (
                      <option key={option} value={option === "Selecciona tipo de consulta" ? "" : option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="Cuéntanos sobre tu proyecto..."
                    rows={6}
                    required
                    className="w-full px-4 py-3 bg-cream-dark rounded-lg border-0 focus:ring-2 focus:ring-gold text-[#1a1a1a] placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Al enviar este formulario aceptas la Política de Privacidad.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-light text-[#1a1a1a] py-3 px-6 rounded-full font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
