"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR, { mutate } from "swr"
import { ArrowLeft, Plus, Trash2, Upload, Save, X } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  category: string
  image?: string
  description?: string
  mediaType?: "image" | "video"
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminProductsPage() {
  const { data, isLoading } = useSWR<{ products: Product[] }>("/api/content/products", fetcher)
  const [products, setProducts] = useState<Product[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  // Sync state when data loads
  if (data?.products && products.length === 0) {
    setProducts(data.products)
  }

  const handleImageUpload = async (productId: string, file: File) => {
    setUploading(productId)
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
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, image: url, mediaType: file.type.startsWith("video/") ? "video" : "image" }
              : p
          )
        )
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setUploading(null)
  }

  const handleRemoveImage = async (productId: string, imageUrl?: string) => {
    if (imageUrl) {
      try {
        await fetch("/api/delete", {
          method: "DELETE",
          body: JSON.stringify({ url: imageUrl }),
        })
      } catch (error) {
        console.error("Delete failed:", error)
      }
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, image: undefined, mediaType: undefined } : p
      )
    )
  }

  const handleUpdateProduct = (productId: string, field: keyof Product, value: string | number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, [field]: value } : p))
    )
  }

  const handleAddProduct = () => {
    const newId = `${Date.now()}`
    setProducts((prev) => [
      ...prev,
      {
        id: newId,
        name: "Nuevo producto",
        price: 50,
        category: "Diseño",
        description: "Describe el producto aqui.",
      },
    ])
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/content/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      })
      mutate("/api/content/products")
      alert("Cambios guardados correctamente")
    } catch (error) {
      console.error("Save failed:", error)
      alert("Error al guardar los cambios")
    }
    setSaving(false)
  }

  if (isLoading) {
    return (
      <div className="bg-cream min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-muted-foreground hover:text-[#1a1a1a] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </Link>
            <h1 className="text-3xl font-bold text-[#1a1a1a]">Productos de Tienda</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-gold-light text-white hover:text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Añadir producto
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start"
            >
              {/* Image Section */}
              <div className="w-full md:w-32 flex-shrink-0">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                  {product.image ? (
                    <>
                      {product.mediaType === "video" ? (
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
                      )}
                      <button
                        onClick={() => handleRemoveImage(product.id, product.image)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => fileInputRefs.current[product.id]?.click()}
                      className="w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-[#1a1a1a] transition-colors"
                      disabled={uploading === product.id}
                    >
                      {uploading === product.id ? (
                        <span className="text-xs">Subiendo...</span>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 mb-1" />
                          <span className="text-xs">Subir media</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  ref={(el) => { fileInputRefs.current[product.id] = el }}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(product.id, file)
                  }}
                />
              </div>

              {/* Fields Section */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Nombre</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleUpdateProduct(product.id, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Precio (€)</label>
                  <input
                    type="number"
                    value={product.price ?? 0}
                    onChange={(e) => handleUpdateProduct(product.id, "price", Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Categoría</label>
                  <input
                    type="text"
                    value={product.category}
                    onChange={(e) => handleUpdateProduct(product.id, "category", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm text-muted-foreground mb-1 block">Descripción</label>
                  <textarea
                    value={product.description || ""}
                    onChange={(e) => handleUpdateProduct(product.id, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    rows={2}
                  />
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="text-red-500 hover:text-red-600 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
