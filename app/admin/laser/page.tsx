"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR, { mutate } from "swr"
import { ArrowLeft, Plus, Trash2, Upload, Save, X } from "lucide-react"

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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminLaserPage() {
  const { data, isLoading } = useSWR<LaserContent>("/api/content/laser", fetcher)
  const [content, setContent] = useState<LaserContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  if (data && !content) {
    setContent(data)
  }

  const handleMaterialImageUpload = async (index: number, file: File) => {
    if (!content) return
    setUploading(`material-${index}`)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "laser/materials")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        const newMaterials = [...content.materials]
        newMaterials[index] = { ...newMaterials[index], image: url }
        setContent({ ...content, materials: newMaterials })
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setUploading(null)
  }

  const handleProductImageUpload = async (productId: string, file: File) => {
    if (!content) return
    setUploading(productId)
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
        setContent({
          ...content,
          products: content.products.map((p) =>
            p.id === productId
              ? { ...p, image: url, mediaType: file.type.startsWith("video/") ? "video" : "image" }
              : p
          ),
        })
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setUploading(null)
  }

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    try {
      await fetch("/api/content/laser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      mutate("/api/content/laser")
      alert("Cambios guardados correctamente")
    } catch (error) {
      console.error("Save failed:", error)
      alert("Error al guardar los cambios")
    }
    setSaving(false)
  }

  const handleAddProduct = () => {
    if (!content) return
    const newId = `laser-${Date.now()}`
    setContent({
      ...content,
      products: [
        ...content.products,
        { id: newId, name: "Nuevo producto", price: 75, description: "Describe el producto aqui." },
      ],
    })
  }

  const handleDeleteProduct = (productId: string) => {
    if (!content) return
    setContent({
      ...content,
      products: content.products.filter((p) => p.id !== productId),
    })
  }

  if (isLoading || !content) {
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
            <h1 className="text-3xl font-bold text-[#1a1a1a]">Grabado Láser</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        {/* Materials Section */}
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">Materiales</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {content.materials.map((material, index) => (
            <div key={material.name} className="bg-white rounded-xl p-4">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative mb-3">
                {material.image ? (
                  <>
                    <Image
                      src={material.image || "/placeholder.svg"}
                      alt={material.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => {
                        const newMaterials = [...content.materials]
                        newMaterials[index] = { ...newMaterials[index], image: undefined }
                        setContent({ ...content, materials: newMaterials })
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => fileInputRefs.current[`material-${index}`]?.click()}
                    className="w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-[#1a1a1a] transition-colors"
                    disabled={uploading === `material-${index}`}
                  >
                    {uploading === `material-${index}` ? (
                      <span className="text-xs">Subiendo...</span>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-xs">Subir imagen</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(el) => { fileInputRefs.current[`material-${index}`] = el }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleMaterialImageUpload(index, file)
                }}
              />
              <input
                type="text"
                value={material.name}
                onChange={(e) => {
                  const newMaterials = [...content.materials]
                  newMaterials[index] = { ...newMaterials[index], name: e.target.value }
                  setContent({ ...content, materials: newMaterials })
                }}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold mb-2"
              />
              <textarea
                value={material.description}
                onChange={(e) => {
                  const newMaterials = [...content.materials]
                  newMaterials[index] = { ...newMaterials[index], description: e.target.value }
                  setContent({ ...content, materials: newMaterials })
                }}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                rows={2}
              />
            </div>
          ))}
        </div>

        {/* Products Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Productos Populares</h2>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-gold-light text-white hover:text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Añadir producto
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {content.products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-4">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative mb-3">
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
                      onClick={() => {
                        setContent({
                          ...content,
                          products: content.products.map((p) =>
                            p.id === product.id ? { ...p, image: undefined, mediaType: undefined } : p
                          ),
                        })
                      }}
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
                  if (file) handleProductImageUpload(product.id, file)
                }}
              />
              <input
                type="text"
                value={product.name}
                onChange={(e) => {
                  setContent({
                    ...content,
                    products: content.products.map((p) =>
                      p.id === product.id ? { ...p, name: e.target.value } : p
                    ),
                  })
                }}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold mb-2"
              />
              <textarea
                value={product.description || ""}
                onChange={(e) => {
                  setContent({
                    ...content,
                    products: content.products.map((p) =>
                      p.id === product.id ? { ...p, description: e.target.value } : p
                    ),
                  })
                }}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none mb-2"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={product.price ?? 0}
                  onChange={(e) => {
                    setContent({
                      ...content,
                      products: content.products.map((p) =>
                        p.id === product.id ? { ...p, price: Number(e.target.value) } : p
                      ),
                    })
                  }}
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-500 hover:text-red-600 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
