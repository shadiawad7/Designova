"use client"

import Link from "next/link"
import { ArrowRight, Camera } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { use } from "react"

const products: Record<string, { id: string; name: string; price: number; category: string; description: string }> = {
  "1": { id: "1", name: "Invitación personalizada – Diseño exclusivo", price: 100, category: "Invitaciones", description: "Invitación diseñada a medida" },
  "2": { id: "2", name: "Tarjeta de visita premium", price: 50, category: "Diseño gráfico", description: "Tarjetas de visita profesionales" },
  "3": { id: "3", name: "Roll-up personalizado", price: 150, category: "Diseño gráfico", description: "Roll-up para eventos y ferias" },
  "4": { id: "4", name: "Grabado láser en madera", price: 75, category: "Grabado láser", description: "Grabado personalizado en madera" },
  "5": { id: "5", name: "Invitación de boda", price: 120, category: "Invitaciones", description: "Invitaciones elegantes para bodas" },
  "6": { id: "6", name: "Logo personalizado", price: 200, category: "Diseño gráfico", description: "Diseño de logo profesional" },
  "7": { id: "7", name: "Grabado en acrílico", price: 80, category: "Grabado láser", description: "Grabado en acrílico transparente" },
  "8": { id: "8", name: "Cartel publicitario", price: 90, category: "Diseño gráfico", description: "Carteles para eventos" },
  "9": { id: "9", name: "Invitación de cumpleaños", price: 60, category: "Invitaciones", description: "Invitaciones para cumpleaños" },
  "10": { id: "10", name: "Pegatinas personalizadas", price: 40, category: "Diseño gráfico", description: "Set de pegatinas personalizadas" },
  "11": { id: "11", name: "Grabado en metal", price: 100, category: "Grabado láser", description: "Grabado en placa metálica" },
  "12": { id: "12", name: "Diseño de flyer", price: 45, category: "Diseño gráfico", description: "Flyers para eventos" },
}

const steps = [
  { number: "1", title: "Realizas el pedido" },
  { number: "2", title: "Enviamos propuesta de diseño" },
  { number: "3", title: "Revisión y aprobación" },
  { number: "4", title: "Producción y entrega" },
]

export default function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { addItem } = useCart()

  const product = products[id] || {
    id: id,
    name: "Invitación personalizada – Diseño exclusivo",
    price: 100,
    category: "Invitaciones",
    description: "Invitación diseñada a medida",
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    })
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Product Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Product Image */}
            <div className="bg-cream-dark rounded-2xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gold mx-auto mb-4" />
                <p className="text-muted-foreground">Imagen del producto</p>
              </div>
            </div>

            {/* Product Info */}
            <div className="py-4">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground mb-2">{product.description}</p>
              <p className="text-muted-foreground text-sm mb-6">
                Invitación elegante y totalmente personalizada para tu evento especial.
                Creamos un diseño único adaptado a tu estilo, ocasión y necesidades.
              </p>
              <p className="text-xl font-bold text-[#1a1a1a] mb-6">
                Precio: {product.price} €
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Añadir al carrito <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/contacto"
                  className="w-full flex items-center justify-center gap-2 border-2 border-gold text-[#1a1a1a] hover:bg-gold/10 px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Consultar diseño personalizado <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-12 bg-cream-dark rounded-2xl p-8">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">Detalles del producto</h2>
            <ul className="space-y-2 text-[#1a1a1a]">
              <li>• Diseño 100% personalizado</li>
              <li>• Revisión incluida</li>
              <li>• Entrega digital o impresa</li>
              <li>• Ideal para bodas, cumpleaños y eventos especiales</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 px-4 bg-cream-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-[#1a1a1a]">
            ¿Cómo funciona?
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {steps.map((step) => (
              <div key={step.number} className="text-center max-w-[150px]">
                <p className="text-sm font-semibold text-[#1a1a1a] mb-2">{step.number}. {step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#1a1a1a]">
            ¿Tienes una idea especial?
          </h2>
          <p className="text-muted-foreground mb-8">
            Estamos aquí para ayudarte a hacerla realidad.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors"
          >
            Contáctanos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
