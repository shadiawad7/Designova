"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useCart } from "@/context/cart-context"
import useSWR from "swr"

interface Product {
  id: string
  name: string
  price: number
  category: string
  image?: string
  description?: string
}

const defaultProducts: Product[] = [
  { id: "1", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "2", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "3", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "4", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "5", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "6", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "7", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "8", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "9", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "10", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "11", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "12", name: "Diseño grafico", price: 50, category: "Diseño" },
]

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TiendaPage() {
  const { addItem } = useCart()
  const { data } = useSWR<{ products: Product[] }>("/api/content/products", fetcher)
  
  const products = data?.products || defaultProducts

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    })
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a] font-serif italic">
            Nuestra tienda
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Diseños personalizados creados con detalle, pensados para momentos especiales.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-cream-dark rounded-2xl p-5 text-center flex flex-col"
              >
                <Link href={`/producto/${product.id}`}>
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4 overflow-hidden hover:opacity-90 transition-opacity relative">
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
                </Link>
                <h3 className="font-semibold text-[#1a1a1a] mb-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">Desde</p>
                <div className="mt-auto">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                  >
                    Añadir al carrito <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#1a1a1a] mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            ¿No encontraste lo que buscabas ?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Nos especializamos en diseño personalizado. Cuéntanos qué buscas y crearemos el producto perfecto para ti.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors"
          >
            Contactar para diseño personalizado <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
