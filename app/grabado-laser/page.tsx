"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, Edit3, Upload, X } from "lucide-react"
import useSWR from "swr"

interface LaserProduct {
  id: string
  name: string
  price: number
  description: string
  image?: string
  mediaType?: "image" | "video"
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
    { id: "laser-1", name: "Diseño grafico", price: 75, description: "Grabado personalizado en madera." },
    { id: "laser-2", name: "Diseño grafico", price: 75, description: "Grabado en acrilico con acabado limpio." },
    { id: "laser-3", name: "Diseños grafico", price: 75, description: "Detalles precisos para regalos." },
    { id: "laser-4", name: "Diseño grafico", price: 75, description: "Grabado para piezas corporativas." },
    { id: "laser-5", name: "Diseño grafico", price: 75, description: "Personalizacion con texto y logo." },
    { id: "laser-6", name: "Diseño grafico", price: 75, description: "Ideal para eventos y souvenirs." },
    { id: "laser-7", name: "Diseño grafico", price: 75, description: "Acabado premium en metal." },
    { id: "laser-8", name: "Diseño grafico", price: 75, description: "Grabado fino en cuero." },
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
  const [content, setContent] = useState<LaserContent>(defaultContent)
  const [editingProduct, setEditingProduct] = useState<LaserProduct | null>(null)
  const [draft, setDraft] = useState<Partial<LaserProduct>>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (data) {
      setContent(data)
    }
  }, [data])

  const handleOpenEdit = (product: LaserProduct) => {
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
      formData.append("folder", "laser/products")

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
    const updatedContent: LaserContent = {
      ...content,
      products: content.products.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              description: String(draft.description || ""),
              price: Number(draft.price || 0),
              image: draft.image,
              mediaType: draft.mediaType,
            }
          : product
      ),
    }

    try {
      await fetch("/api/content/laser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent),
      })
      setContent(updatedContent)
      setEditingProduct(null)
    } catch (error) {
      console.error("Save failed:", error)
      alert("Error al guardar los cambios")
    }
    setSaving(false)
  }

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
              <div key={product.id} className="group relative">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleOpenEdit(product)
                  }}
                  className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-2 text-[#1a1a1a] shadow hover:bg-white"
                  aria-label="Editar producto"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden relative">
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
                <h3 className="font-medium text-[#1a1a1a] mb-1">{product.name}</h3>
                {product.description ? (
                  <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
                ) : null}
                <p className="text-muted-foreground text-sm mb-3">Desde {product.price} €</p>
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
