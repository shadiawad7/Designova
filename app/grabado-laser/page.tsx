"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import useSWR from "swr"

interface LaserProduct {
  id: string
  name: string
  price: number
  image?: string
}

interface Material {
  name: string
  description: string
  image?: string
}

interface LaserContent {
  materials: Material[]
  products: LaserProduct[]
}

const defaultContent: LaserContent = {
  materials: [
    { name: "Madera", description: "Grabado en madera natural para sensación cálida y natural" },
    { name: "Acrílico", description: "Grabado en acrílico transparente o de color para look moderno" },
    { name: "Cuero", description: "Grabado dedicado en cuero para añadido lujos" },
    { name: "Metal", description: "Grabado en varios metales para productos duraderos" },
  ],
  products: [
    { id: "laser-1", name: "Diseño grafico", price: 75 },
    { id: "laser-2", name: "Diseño grafico", price: 75 },
    { id: "laser-3", name: "Diseños grafico", price: 75 },
    { id: "laser-4", name: "Diseño grafico", price: 75 },
    { id: "laser-5", name: "Diseño grafico", price: 75 },
    { id: "laser-6", name: "Diseño grafico", price: 75 },
    { id: "laser-7", name: "Diseño grafico", price: 75 },
    { id: "laser-8", name: "Diseño grafico", price: 75 },
  ],
}

const steps = [
  { number: "1", title: "Elección de Producto", description: "Elige el producto y material" },
  { number: "2", title: "Diseño", description: "Envía el texto o imagen" },
  { number: "3", title: "Aprobación", description: "Recibe vista previa" },
  { number: "4", title: "Grabado", description: "Producimos y enviamos" },
]

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function GrabadoLaserPage() {
  const { data } = useSWR<LaserContent>("/api/content/laser", fetcher)
  const content = data || defaultContent

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="bg-gold py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a1a] underline decoration-[#1a1a1a] underline-offset-8">
            Grabado láser personalizado
          </h1>
          <p className="text-[#1a1a1a]/80 mb-8 max-w-2xl mx-auto">
            Productos con toque personal – nombres, fechas, dedicatorias y logos en grabado de calidad y precisión
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Empezamos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1a1a1a]">
            Materiales para grabado
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Trabajamos con una amplia variedad de materiales de calidad
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.materials.map((material) => (
              <div key={material.name} className="text-center">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                  {material.image ? (
                    <Image
                      src={material.image || "/placeholder.svg"}
                      alt={material.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">{material.name}</h3>
                <p className="text-muted-foreground text-sm">{material.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section - Now redirects to Contact */}
      <section className="py-16 px-4 bg-cream-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1a1a1a] underline decoration-gold underline-offset-8">
            Productos populares
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Ideas para regalos perfectos con grabado personal
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.products.map((product) => (
              <div key={product.id} className="group">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden relative">
                  {product.image ? (
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">Desde</p>
                {/* Changed from addItem to Link to Contact */}
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Pedir ahora <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1a1a1a]">
            Proceso de grabado
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {steps.map((step) => (
              <div key={step.number} className="text-center max-w-[140px]">
                <div className="w-16 h-16 bg-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-[#1a1a1a] text-2xl font-bold">{step.number}</span>
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            ¿Tienes idea para un producto especial?
          </h2>
          <p className="text-white/70 mb-8">
            Nos encantaría escuchar y ayudar a hacer realidad tu idea
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
