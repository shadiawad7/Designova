"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Heart, Award, Users, Camera, Edit3, Trash2, Upload, X } from "lucide-react"

interface SobreItem {
  id: string
  foto: string | null
}

const values = [
  {
    icon: Heart,
    title: "Amor por los detalles",
    description: "Creemos que los pequeños detalles son los que crean la gran experiencia. Cada diseño recibe toda nuestra atención.",
  },
  {
    icon: Award,
    title: "Calidad sin compromisos",
    description: "Trabajamos solo con los mejores materiales y la tecnología más avanzada para garantizar un resultado perfecto.",
  },
  {
    icon: Users,
    title: "Servicio personal",
    description: "Cada cliente es un mundo entero. Te acompañamos en cada paso, desde la idea hasta el producto terminado.",
  },
]

export default function SobreNosotrosPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [recordId, setRecordId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draftImage, setDraftImage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/sobre-nosotros")
        const data = (await response.json()) as { items: SobreItem[] }
        if (response.ok && data.items.length > 0) {
          setImageUrl(data.items[0].foto || null)
          setRecordId(data.items[0].id)
        }
      } catch (error) {
        console.error("Fetch failed:", error)
      }
    }
    load()
  }, [])

  const handleMediaUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "sobre-nosotros")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setDraftImage(url)
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setUploading(false)
  }

  const handleSave = async () => {
    if (!draftImage) return
    setSaving(true)
    try {
      const response = await fetch("/api/sobre-nosotros", {
        method: recordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recordId ? { id: recordId, foto: draftImage } : { foto: draftImage }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Error al guardar")
      }
      setImageUrl(result.item.foto || draftImage)
      setRecordId(result.item.id || recordId)
      setIsEditing(false)
      setDraftImage(null)
    } catch (error) {
      console.error("Save failed:", error)
      alert("Error al guardar la imagen")
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!recordId) return
    const confirmed = window.confirm("¿Eliminar la imagen?")
    if (!confirmed) return
    setSaving(true)
    try {
      const response = await fetch("/api/sobre-nosotros", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recordId }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar")
      }
      setImageUrl(null)
      setRecordId(null)
      setIsEditing(false)
      setDraftImage(null)
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Error al eliminar la imagen")
    }
    setSaving(false)
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Header Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1a1a1a]">
            Un poco sobre nosotros
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            DESIGNOVA nació del amor por el diseño, los pequeños detalles y los grandes momentos de la vida. 
            Combinamos creatividad, tecnología y precisión para transformar ideas en productos emocionantes y únicos.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4 bg-cream-dark">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative bg-gray-200 rounded-2xl aspect-[4/3] overflow-hidden flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true)
                  setDraftImage(imageUrl)
                }}
                className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-[#1a1a1a] shadow hover:bg-white"
                aria-label="Editar imagen"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              {recordId ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="absolute top-4 left-4 z-10 rounded-full bg-white/90 p-2 text-red-500 shadow hover:bg-white"
                  aria-label="Eliminar imagen"
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Imagen del estudio"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gold mx-auto mb-4" />
                  <p className="text-muted-foreground">Imagen del estudio</p>
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a1a1a]">
                Nuestra historia
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Todo comenzó con una verdadera pasión por el diseño y la innovación. Entendíamos que cada evento, 
                  cada momento importante en la vida, merece un diseño que cuente su historia única.
                </p>
                <p>
                  Hoy, DESIGNOVA es un estudio de diseño completo que combina habilidades gráficas avanzadas con 
                  tecnología de grabado láser preciso. Estamos orgullosos de nuestra capacidad de tomar cualquier idea, 
                  cualquier sueño, y convertirlo en una realidad tangible y hermosa.
                </p>
                <p>
                  Cada proyecto que hacemos es nuevo, emocionante y desafiante. No dejamos de aprender, 
                  desarrollar e innovar, porque sabemos que nuestros clientes vienen a nosotros con los momentos 
                  más importantes de sus vidas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1a1a1a]">
            Nuestros valores
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-cream-dark rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-gold/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-[#1a1a1a] underline decoration-gold underline-offset-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isEditing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Editar imagen</h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setDraftImage(null)
                }}
                className="rounded-full p-1 text-muted-foreground hover:text-[#1a1a1a]"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-border p-3">
                <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 relative">
                  {draftImage ? (
                    <Image
                      src={draftImage}
                      alt="Vista previa"
                      fill
                      className="object-cover"
                    />
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
                  {uploading ? "Subiendo..." : "Subir foto"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) handleMediaUpload(file)
                  }}
                />
              </div>
              <div className="flex justify-end gap-3">
                {recordId ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    disabled={saving}
                  >
                    Eliminar
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setDraftImage(null)
                  }}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-cream-dark transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !draftImage}
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
