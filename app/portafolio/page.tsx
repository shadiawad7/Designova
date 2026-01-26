"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import useSWR from "swr"
import { Edit3, Upload, X } from "lucide-react"

interface Project {
  id: number
  title: string
  category: string
  description: string
  price: number
  image?: string
  mediaType?: "image" | "video"
}

const defaultProjects: Project[] = Array(16).fill(null).map((_, i) => ({
  id: i + 1,
  title: "Diseño grafico",
  category: ["Invitaciones", "Grabado", "Diseño gráfico"][i % 3],
  description: "Proyecto personalizado con detalles a medida.",
  price: 50 + (i % 4) * 25,
}))

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function PortafolioPage() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const { data } = useSWR<{ projects: Project[] }>("/api/content/portfolio", fetcher)
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [draft, setDraft] = useState<Partial<Project>>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (data?.projects) {
      setProjects(data.projects)
    }
  }, [data?.projects])

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project)
    setDraft({
      description: project.description || "",
      price: project.price,
      image: project.image,
      mediaType: project.mediaType,
    })
  }

  const handleMediaUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "portfolio")

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
    if (!editingProject) return
    setSaving(true)
    const updatedProjects = projects.map((project) =>
      project.id === editingProject.id
        ? {
            ...project,
            description: String(draft.description || ""),
            price: Number(draft.price || 0),
            image: draft.image,
            mediaType: draft.mediaType,
          }
        : project
    )

    try {
      await fetch("/api/content/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: updatedProjects }),
      })
      setProjects(updatedProjects)
      setEditingProject(null)
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a]">
            Nuestro portafolio
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Galería de proyectos que diseñamos y personalizamos para nuestros clientes especiales
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                className="text-left relative"
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setSelectedProject(selectedProject === project.id ? null : project.id)
                  }
                }}
              >
                <div
                  className={`bg-cream-dark rounded-2xl p-4 transition-all ${
                    selectedProject === project.id ? "ring-2 ring-gold" : "hover:shadow-lg"
                  }`}
                >
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      handleOpenEdit(project)
                    }}
                    className="absolute right-6 top-6 z-10 rounded-full bg-white/90 p-2 text-[#1a1a1a] shadow hover:bg-white"
                    aria-label="Editar proyecto"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <div className="aspect-square bg-gray-200 rounded-xl mb-3 overflow-hidden relative">
                    {project.image ? (
                      project.mediaType === "video" ? (
                        <video
                          src={project.image}
                          className="h-full w-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gray-300" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#1a1a1a] text-center">{project.title}</p>
                  {project.description ? (
                    <p className="text-xs text-muted-foreground text-center mt-1">{project.description}</p>
                  ) : null}
                  {project.price != null ? (
                    <p className="text-xs text-muted-foreground text-center mt-1">Desde {project.price} €</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {editingProject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Editar proyecto</h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
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
                        alt={editingProject.title}
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
                  onClick={() => setEditingProject(null)}
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
