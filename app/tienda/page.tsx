"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Edit3, Plus, Trash2, Upload, X } from "lucide-react"
import { useCart } from "@/context/cart-context"
import useSWR from "swr"

interface Product {
  id: string
  name: string
  price: number | null
  category: string
  image?: string
  description?: string
}

const defaultProducts: Product[] = []

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const isVideoUrl = (url?: string) => {
  if (!url) return false
  const lower = url.toLowerCase()
  return [".mp4", ".mov", ".webm", ".m4v", ".ogg"].some((ext) => lower.includes(ext))
}

export default function TiendaPage() {
  const { addItem } = useCart()
  const { data } = useSWR<{ items: { id: string; foto: string | null; nombre: string | null; descripcion: string | null; precio: number | null }[] }>(
    "/api/tienda",
    fetcher
  )
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [draft, setDraft] = useState<Partial<Product>>({})
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (data?.items) {
      const mapped = data.items.map((item) => ({
        id: item.id,
        name: item.nombre || "Sin nombre",
        price: item.precio,
        category: "Tienda",
        image: item.foto || undefined,
        description: item.descripcion || undefined,
      }))
      setProducts(mapped)
    }
  }, [data?.items])

  const itemsEmpty = useMemo(() => products.length === 0, [products.length])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      category: product.category,
      image: product.image,
    })
  }

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product)
    setIsCreating(false)
    setDraft({
      name: product.name,
      description: product.description || "",
      price: product.price ?? 0,
      image: product.image,
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
        }))
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setUploading(false)
  }

  const handleSaveEdit = async () => {
    if (!editingProduct && !isCreating) return
    setSaving(true)

    try {
      if (isCreating) {
        const response = await fetch("/api/tienda", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: String(draft.name || "Sin nombre"),
            descripcion: String(draft.description || ""),
            precio: Number(draft.price || 0),
            foto: draft.image || null,
          }),
        })
        const result = await response.json()
        if (response.ok) {
          const created = result.item
          setProducts((prev) => [
            ...prev,
            {
              id: created.id,
              name: created.nombre || "Sin nombre",
              price: created.precio,
              category: "Tienda",
              image: created.foto || undefined,
              description: created.descripcion || undefined,
            },
          ])
          setEditingProduct(null)
          setIsCreating(false)
        } else {
          throw new Error(result.error || "Error al crear la carta")
        }
      } else if (editingProduct) {
        const response = await fetch("/api/tienda", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProduct.id,
            nombre: String(draft.name || "Sin nombre"),
            descripcion: String(draft.description || ""),
            precio: Number(draft.price || 0),
            foto: draft.image || null,
          }),
        })
        const result = await response.json()
        if (response.ok) {
          const updated = result.item
          setProducts((prev) =>
            prev.map((product) =>
              product.id === updated.id
                ? {
                    ...product,
                    name: updated.nombre || "Sin nombre",
                    description: updated.descripcion || "",
                    price: updated.precio,
                    image: updated.foto || undefined,
                  }
                : product
            )
          )
          setEditingProduct(null)
          setIsCreating(false)
        } else {
          throw new Error(result.error || "Error al guardar los cambios")
        }
      }
    } catch (error) {
      console.error("Save failed:", error)
      alert("Error al guardar los cambios")
    }
    setSaving(false)
  }

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm("¿Eliminar esta carta?")
    if (!confirmed) return
    setDeletingId(product.id)
    try {
      const response = await fetch("/api/tienda", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar la carta")
      }
      setProducts((prev) => prev.filter((item) => item.id !== product.id))
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Error al eliminar la carta")
    }
    setDeletingId(null)
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
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null)
                setIsCreating(true)
                setDraft({
                  name: "",
                  description: "",
                  price: 0,
                  image: undefined,
                })
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-gold-light transition-colors"
            >
              <Plus className="h-4 w-4" />
              Crear carta
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-40 px-4 pb-0">
        <div className="max-w-6xl mx-auto">
          {itemsEmpty ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
              No hay cartas creadas todavía. Usa “Crear carta” para añadir la primera.
            </div>
          ) : null}
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
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleDelete(product)
                  }}
                  className="absolute top-3 left-3 z-10 rounded-full bg-white/90 p-2 text-red-500 shadow hover:bg-white"
                  aria-label="Eliminar producto"
                  disabled={deletingId === product.id}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <Link href={`/producto/${product.id}`}>
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4 overflow-hidden hover:opacity-90 transition-opacity relative">
                    {product.image ? (
                      isVideoUrl(product.image) ? (
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
                <p className="text-muted-foreground text-sm mb-4">
                  Desde {product.price ?? 0} €
                </p>
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
      <section className="py-16 px-4 bg-cream-dark mt-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#1a1a1a]">
            ¿No encontraste lo que buscabas ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nos especializamos en diseño personalizado. Cuéntanos qué buscas y crearemos el producto perfecto para ti.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors"
          >
            Contactar para diseño personalizado <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {editingProduct || isCreating ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">
                {isCreating ? "Crear carta" : "Editar producto"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null)
                  setIsCreating(false)
                }}
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
                    isVideoUrl(draft.image) ? (
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
                        alt={editingProduct?.name || String(draft.name || "Carta")}
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
                  className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-gold-light hover:text-[#1a1a1a] transition-colors"
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
                <label className="mb-1 block text-sm text-muted-foreground">Nombre</label>
                <input
                  type="text"
                  value={String(draft.name || "")}
                  onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
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
                  onClick={() => {
                    setEditingProduct(null)
                    setIsCreating(false)
                  }}
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
