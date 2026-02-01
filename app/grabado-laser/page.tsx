"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Edit3, Plus, Trash2, Upload, X } from "lucide-react"
import useSWR from "swr"

interface LaserProduct {
  id: string
  name: string
  price: number | null
  description: string
  image?: string
}

interface Material {
  id: string
  name: string
  description: string
  image?: string
}

interface LaserContent {
  materials: Material[]
  products: LaserProduct[]
}

const defaultContent: LaserContent = {
  materials: [],
  products: [],
}

const steps = [
  { number: "1", title: "Elección de Producto", description: "Elige el producto y material" },
  { number: "2", title: "Diseño", description: "Envía el texto o imagen" },
  { number: "3", title: "Aprobación", description: "Recibe vista previa" },
  { number: "4", title: "Grabado", description: "Producimos y enviamos" },
]

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const isVideoUrl = (url?: string) => {
  if (!url) return false
  const lower = url.toLowerCase()
  return [".mp4", ".mov", ".webm", ".m4v", ".ogg"].some((ext) => lower.includes(ext))
}

export default function GrabadoLaserPage() {
  const { data } = useSWR<LaserContent>("/api/content/laser", fetcher)
  const { data: materialsData } = useSWR<{ items: { id: string; foto: string | null; nombre: string | null; descripcion: string | null }[] }>(
    "/api/materiales-grabado",
    fetcher
  )
  const { data: popularData } = useSWR<{ items: { id: string; foto: string | null; nombre: string | null; descripcion: string | null; precio: number | null }[] }>(
    "/api/productos-populares",
    fetcher
  )
  const [content, setContent] = useState<LaserContent>(defaultContent)
  const [editingProduct, setEditingProduct] = useState<LaserProduct | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [draft, setDraft] = useState<Partial<LaserProduct>>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false)
  const [materialDraft, setMaterialDraft] = useState<Partial<Material>>({})
  const [savingMaterial, setSavingMaterial] = useState(false)
  const [uploadingMaterial, setUploadingMaterial] = useState(false)
  const [deletingMaterialId, setDeletingMaterialId] = useState<string | null>(null)
  const materialFileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (data) {
      setContent(data)
    }
  }, [data])

  useEffect(() => {
    if (materialsData?.items) {
      setContent((prev) => ({
        ...prev,
        materials: materialsData.items.map((item) => ({
          id: item.id,
          name: item.nombre || "Sin nombre",
          description: item.descripcion || "",
          image: item.foto || undefined,
        })),
      }))
    }
  }, [materialsData?.items])

  useEffect(() => {
    if (popularData?.items) {
      setContent((prev) => ({
        ...prev,
        products: popularData.items.map((item) => ({
          id: item.id,
          name: item.nombre || "Sin nombre",
          description: item.descripcion || "",
          price: item.precio,
          image: item.foto || undefined,
        })),
      }))
    }
  }, [popularData?.items])

  const itemsEmpty = useMemo(() => content.products.length === 0, [content.products.length])
  const materialsEmpty = useMemo(() => content.materials.length === 0, [content.materials.length])

  const handleOpenEdit = (product: LaserProduct) => {
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
        const response = await fetch("/api/productos-populares", {
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
          setContent((prev) => ({
            ...prev,
            products: [
              ...prev.products,
              {
                id: created.id,
                name: created.nombre || "Sin nombre",
                description: created.descripcion || "",
                price: created.precio,
                image: created.foto || undefined,
              },
            ],
          }))
          setEditingProduct(null)
          setIsCreating(false)
        } else {
          throw new Error(result.error || "Error al crear la carta")
        }
      } else if (editingProduct) {
        const response = await fetch("/api/productos-populares", {
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
          setContent((prev) => ({
            ...prev,
            products: prev.products.map((product) =>
              product.id === updated.id
                ? {
                    ...product,
                    name: updated.nombre || "Sin nombre",
                    description: updated.descripcion || "",
                    price: updated.precio,
                    image: updated.foto || undefined,
                  }
                : product
            ),
          }))
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

  const handleDelete = async (product: LaserProduct) => {
    const confirmed = window.confirm("¿Eliminar esta carta?")
    if (!confirmed) return
    setDeletingId(product.id)
    try {
      const response = await fetch("/api/productos-populares", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar la carta")
      }
      setContent((prev) => ({
        ...prev,
        products: prev.products.filter((item) => item.id !== product.id),
      }))
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Error al eliminar la carta")
    }
    setDeletingId(null)
  }

  const handleOpenMaterialEdit = (material: Material) => {
    setEditingMaterial(material)
    setIsCreatingMaterial(false)
    setMaterialDraft({
      name: material.name,
      description: material.description || "",
      image: material.image,
    })
  }

  const handleMaterialUpload = async (file: File) => {
    setUploadingMaterial(true)
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
        setMaterialDraft((prev) => ({
          ...prev,
          image: url,
        }))
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setUploadingMaterial(false)
  }

  const handleSaveMaterial = async () => {
    if (!editingMaterial && !isCreatingMaterial) return
    setSavingMaterial(true)
    try {
      if (isCreatingMaterial) {
        const response = await fetch("/api/materiales-grabado", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: String(materialDraft.name || "Sin nombre"),
            descripcion: String(materialDraft.description || ""),
            foto: materialDraft.image || null,
          }),
        })
        const result = await response.json()
        if (response.ok) {
          const created = result.item
          setContent((prev) => ({
            ...prev,
            materials: [
              ...prev.materials,
              {
                id: created.id,
                name: created.nombre || "Sin nombre",
                description: created.descripcion || "",
                image: created.foto || undefined,
              },
            ],
          }))
          setEditingMaterial(null)
          setIsCreatingMaterial(false)
        } else {
          throw new Error(result.error || "Error al crear el material")
        }
      } else if (editingMaterial) {
        const response = await fetch("/api/materiales-grabado", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMaterial.id,
            nombre: String(materialDraft.name || "Sin nombre"),
            descripcion: String(materialDraft.description || ""),
            foto: materialDraft.image || null,
          }),
        })
        const result = await response.json()
        if (response.ok) {
          const updated = result.item
          setContent((prev) => ({
            ...prev,
            materials: prev.materials.map((material) =>
              material.id === updated.id
                ? {
                    ...material,
                    name: updated.nombre || "Sin nombre",
                    description: updated.descripcion || "",
                    image: updated.foto || undefined,
                  }
                : material
            ),
          }))
          setEditingMaterial(null)
          setIsCreatingMaterial(false)
        } else {
          throw new Error(result.error || "Error al guardar los cambios")
        }
      }
    } catch (error) {
      console.error("Save failed:", error)
      alert("Error al guardar los cambios")
    }
    setSavingMaterial(false)
  }

  const handleDeleteMaterial = async (material: Material) => {
    const confirmed = window.confirm("¿Eliminar este material?")
    if (!confirmed) return
    setDeletingMaterialId(material.id)
    try {
      const response = await fetch("/api/materiales-grabado", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: material.id }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar el material")
      }
      setContent((prev) => ({
        ...prev,
        materials: prev.materials.filter((item) => item.id !== material.id),
      }))
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Error al eliminar el material")
    }
    setDeletingMaterialId(null)
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
          <div className="mb-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setEditingMaterial(null)
                setIsCreatingMaterial(true)
                setMaterialDraft({
                  name: "",
                  description: "",
                  image: undefined,
                })
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Crear material
            </button>
          </div>
          {materialsEmpty ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
              No hay materiales creados todavía. Usa “Crear material” para añadir el primero.
            </div>
          ) : null}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.materials.map((material, index) => (
              <div key={material.id || `${material.name}-${index}`} className="text-center relative">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleOpenMaterialEdit(material)
                  }}
                  className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-2 text-[#1a1a1a] shadow hover:bg-white"
                  aria-label="Editar material"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleDeleteMaterial(material)
                  }}
                  className="absolute left-2 top-2 z-10 rounded-full bg-white/90 p-2 text-red-500 shadow hover:bg-white"
                  aria-label="Eliminar material"
                  disabled={deletingMaterialId === material.id}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
          <div className="mb-8 flex justify-center">
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
              className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Crear carta
            </button>
          </div>
          {itemsEmpty ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
              No hay cartas creadas todavía. Usa “Crear carta” para añadir la primera.
            </div>
          ) : null}
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
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleDelete(product)
                  }}
                  className="absolute left-2 top-2 z-10 rounded-full bg-white/90 p-2 text-red-500 shadow hover:bg-white"
                  aria-label="Eliminar producto"
                  disabled={deletingId === product.id}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden relative">
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
              <h3 className="font-medium text-[#1a1a1a] mb-1">{product.name}</h3>
              {product.description ? (
                <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
              ) : null}
              <p className="text-muted-foreground text-sm mb-3">Desde {product.price ?? 0} €</p>
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

      {editingMaterial || isCreatingMaterial ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">
                {isCreatingMaterial ? "Crear material" : "Editar material"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingMaterial(null)
                  setIsCreatingMaterial(false)
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
                  {materialDraft.image ? (
                    <Image
                      src={materialDraft.image}
                      alt={editingMaterial?.name || String(materialDraft.name || "Material")}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => materialFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors"
                  disabled={uploadingMaterial}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingMaterial ? "Subiendo..." : "Subir foto"}
                </button>
                <input
                  ref={materialFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) handleMaterialUpload(file)
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Nombre</label>
                <input
                  type="text"
                  value={String(materialDraft.name || "")}
                  onChange={(event) => setMaterialDraft((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Descripción</label>
                <textarea
                  value={String(materialDraft.description || "")}
                  onChange={(event) => setMaterialDraft((prev) => ({ ...prev, description: event.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMaterial(null)
                    setIsCreatingMaterial(false)
                  }}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-cream-dark transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveMaterial}
                  disabled={savingMaterial}
                  className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-gold-light transition-colors disabled:opacity-60"
                >
                  {savingMaterial ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
