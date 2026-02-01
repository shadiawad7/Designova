"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR, { mutate } from "swr"
import { ArrowLeft, Plus, Trash2, Upload, Save, X } from "lucide-react"

interface GraphicService {
  id: string
  title: string
  description: string
  price: number
  image?: string
  mediaType?: "image" | "video"
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminGraphicDesignPage() {
  const { data, isLoading } = useSWR<{ services: GraphicService[] }>("/api/content/graphic-design", fetcher)
  const [services, setServices] = useState<GraphicService[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  if (data?.services && services.length === 0) {
    setServices(data.services)
  }

  const handleMediaUpload = async (serviceId: string, file: File) => {
    setUploading(serviceId)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "graphic-design/services")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setServices((prev) =>
          prev.map((service) =>
            service.id === serviceId
              ? { ...service, image: url, mediaType: file.type.startsWith("video/") ? "video" : "image" }
              : service
          )
        )
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setUploading(null)
  }

  const handleRemoveMedia = async (serviceId: string, imageUrl?: string) => {
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
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? { ...service, image: undefined, mediaType: undefined } : service
      )
    )
  }

  const handleUpdateService = (serviceId: string, field: keyof GraphicService, value: string | number) => {
    setServices((prev) =>
      prev.map((service) => (service.id === serviceId ? { ...service, [field]: value } : service))
    )
  }

  const handleAddService = () => {
    const newId = `service-${Date.now()}`
    setServices((prev) => [
      ...prev,
      {
        id: newId,
        title: "Nuevo servicio",
        description: "Describe el servicio aqui.",
        price: 50,
      },
    ])
  }

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((service) => service.id !== serviceId))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/content/graphic-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services }),
      })
      mutate("/api/content/graphic-design")
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
            <h1 className="text-3xl font-bold text-[#1a1a1a]">Diseño gráfico</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddService}
              className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-gold-light text-white hover:text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Añadir servicio
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
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start"
            >
              <div className="w-full md:w-36 flex-shrink-0">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                  {service.image ? (
                    <>
                      {service.mediaType === "video" ? (
                        <video
                          src={service.image}
                          className="h-full w-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                      )}
                      <button
                        onClick={() => handleRemoveMedia(service.id, service.image)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => fileInputRefs.current[service.id]?.click()}
                      className="w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-[#1a1a1a] transition-colors"
                      disabled={uploading === service.id}
                    >
                      {uploading === service.id ? (
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
                  ref={(el) => { fileInputRefs.current[service.id] = el }}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleMediaUpload(service.id, file)
                  }}
                />
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">Título</label>
                  <input
                    type="text"
                    value={service.title || ""}
                    onChange={(e) => handleUpdateService(service.id, "title", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Precio (€)</label>
                  <input
                    type="number"
                    value={service.price ?? 0}
                    onChange={(e) => handleUpdateService(service.id, "price", Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm text-muted-foreground mb-1 block">Descripción</label>
                  <textarea
                    value={service.description || ""}
                    onChange={(e) => handleUpdateService(service.id, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    rows={2}
                  />
                </div>
              </div>

              <button
                onClick={() => handleDeleteService(service.id)}
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
