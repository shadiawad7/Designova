"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, Edit3, Upload, X } from "lucide-react"
import { useCart } from "@/context/cart-context"
import useSWR from "swr"

interface Product {
  id: string
  name: string
  price: number
  category: string
  image?: string
  description?: string
  mediaType?: "image" | "video"
}

const defaultProducts: Product[] = [
  { id: "1", name: "Diseño grafico", price: 50, category: "Diseño", description: "Diseño personalizado para redes." },
  { id: "2", name: "Diseño grafico", price: 50, category: "Diseño", description: "Propuesta creativa para tu marca." },
  { id: "3", name: "Diseño grafico", price: 50, category: "Diseño", description: "Diseño a medida para impresos." },
  { id: "4", name: "Diseño grafico", price: 50, category: "Diseño", description: "Composición visual para eventos." },
  { id: "5", name: "Diseño grafico", price: 50, category: "Diseño", description: "Piezas gráficas para promociones." },
  { id: "6", name: "Diseño grafico", price: 50, category: "Diseño", description: "Diseños exclusivos y adaptados." },
  { id: "7", name: "Diseño grafico", price: 50, category: "Diseño", description: "Material gráfico para campañas." },
  { id: "8", name: "Diseño grafico", price: 50, category: "Diseño", description: "Diseño profesional para negocios." },
  { id: "9", name: "Diseño grafico", price: 50, category: "Diseño", description: "Arte final para impresión." },
  { id: "10", name: "Diseño grafico", price: 50, category: "Diseño", description: "Diseño editorial y publicitario." },
  { id: "11", name: "Diseño grafico", price: 50, category: "Diseño", description: "Piezas gráficas con identidad." },
  { id: "12", name: "Diseño grafico", price: 50, category: "Diseño", description: "Soluciones gráficas creativas." },
]

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TiendaPage() {
  const { addItem } = useCart()
  const { data } = useSWR<{ products: Product[] }>("/api/content/products", fetcher)
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [draft, setDraft] = useState<Partial<Product>>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (data?.products) {
      setProducts(data.products)
    }
  }, [data?.products])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    })
  }

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product)
    setDraft({
      description: product.description || "",
      price: product.price,
      image: product.image,
      mediaType: product.mediaType,
    })
  }

  const handleMediaUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "products")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setDraft((prev) => ({
          ...prev,
          image: url,
          mediaType: file.type.startsWith("video/") ? "video" : "image",
        }))
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setUploading(false)
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return
    setSaving(true)
    const updatedProducts = products.map((product) =>
      product.id === editingProduct.id
        ? {
            ...product,
            description: String(draft.description || ""),
            price: Number(draft.price || 0),
            image: draft.image,
            mediaType: draft.mediaType,
          }
        : product
    )

    try {
      await fetch("/api/content/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: updatedProducts }),
      })
      setProducts(updatedProducts)
      setEditingProduct(null)
    } catch (error) {
      console.error("Save failed:", error)
      alert("Error al guardar los cambios")
    }
    setSaving(false)
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
                className="bg-cream-dark rounded-2xl p-5 text-center flex flex-col relative"
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleOpenEdit(product)
                  }}
                  className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-[#1a1a1a] shadow hover:bg-white"
                  aria-label="Editar producto"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <Link href={`/producto/${product.id}`}>
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4 overflow-hidden hover:opacity-90 transition-opacity relative">
                    {product.image ? (
                      product.mediaType === "video" ? (
                        <video
                          src={product.image}
                          className="h-full w-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gray-300" />
                    )}
                  </div>
                </Link>
                <h3 className="font-semibold text-[#1a1a1a] mb-1">{product.name}</h3>
                {product.description ? (
                  <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
                ) : null}
                <p className="text-muted-foreground text-sm mb-4">Desde {product.price} €</p>
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

      {editingProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Editar producto</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="rounded-full p-1 text-muted-foreground hover:text-[#1a1a1a]"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-border p-3">
                <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
                  {draft.image ? (
                    draft.mediaType === "video" ? (
                      <video
                        src={draft.image}
                        className="h-full w-full object-cover"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <Image
                        src={draft.image}
                        alt={editingProduct.name}
                        fill
                        className="object-cover"
                      />
                    )
                  ) : (
                    <div className="h-full w-full bg-gray-200" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors"
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "Subiendo..." : "Subir foto o video"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) handleMediaUpload(file)
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Descripción</label>
                <textarea
                  value={String(draft.description || "")}
                  onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Precio (€)</label>
                <input
                  type="number"
                  value={draft.price ?? 0}
                  onChange={(event) => setDraft((prev) => ({ ...prev, price: Number(event.target.value) }))}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-cream-dark transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-gold-light transition-colors disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
