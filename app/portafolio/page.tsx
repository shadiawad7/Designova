"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import useSWR from "swr"
import { Edit3, Plus, Trash2, Upload, X } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  price: number | null
  image?: string
}

const defaultProjects: Project[] = []

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PortafolioPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const { data } = useSWR<{ items: { id: string; foto: string | null; nombre: string | null; descripcion: string | null; precio: number | null }[] }>(
    "/api/portafolio",
    fetcher
  )
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [draft, setDraft] = useState<Partial<Project>>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (data?.items) {
      setProjects(
        data.items.map((item) => ({
          id: item.id,
          title: item.nombre || "Sin nombre",
          description: item.descripcion || "",
          price: item.precio,
          image: item.foto || undefined,
        }))
      )
    }
  }, [data?.items])

  const itemsEmpty = useMemo(() => projects.length === 0, [projects.length])

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project)
    setIsCreating(false)
    setDraft({
      title: project.title,
      description: project.description || "",
      price: project.price ?? 0,
      image: project.image,
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
        }))
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setUploading(false)
  }

  const handleSaveEdit = async () => {
    if (!editingProject && !isCreating) return
    setSaving(true)

    try {
      if (isCreating) {
        const response = await fetch("/api/portafolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: String(draft.title || "Sin nombre"),
            descripcion: String(draft.description || ""),
            precio: Number(draft.price || 0),
            foto: draft.image || null,
          }),
        })
        const result = await response.json()
        if (response.ok) {
          const created = result.item
          setProjects((prev) => [
            ...prev,
            {
              id: created.id,
              title: created.nombre || "Sin nombre",
              description: created.descripcion || "",
              price: created.precio,
              image: created.foto || undefined,
            },
          ])
          setEditingProject(null)
          setIsCreating(false)
        } else {
          throw new Error(result.error || "Error al crear el proyecto")
        }
      } else if (editingProject) {
        const response = await fetch("/api/portafolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProject.id,
            nombre: String(draft.title || "Sin nombre"),
            descripcion: String(draft.description || ""),
            precio: Number(draft.price || 0),
            foto: draft.image || null,
          }),
        })
        const result = await response.json()
        if (response.ok) {
          const updated = result.item
          setProjects((prev) =>
            prev.map((project) =>
              project.id === updated.id
                ? {
                    ...project,
                    title: updated.nombre || "Sin nombre",
                    description: updated.descripcion || "",
                    price: updated.precio,
                    image: updated.foto || undefined,
                  }
                : project
            )
          )
          setEditingProject(null)
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

  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm("¿Eliminar este proyecto?")
    if (!confirmed) return
    setDeletingId(project.id)
    try {
      const response = await fetch("/api/portafolio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project.id }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar el proyecto")
      }
      setProjects((prev) => prev.filter((item) => item.id !== project.id))
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Error al eliminar el proyecto")
    }
    setDeletingId(null)
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
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setEditingProject(null)
                setIsCreating(true)
                setDraft({
                  title: "",
                  description: "",
                  price: 0,
                  image: undefined,
                })
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-gold-light transition-colors"
            >
              <Plus className="h-4 w-4" />
              Crear proyecto
            </button>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {itemsEmpty ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
              No hay proyectos creados todavía. Usa “Crear proyecto” para añadir el primero.
            </div>
          ) : null}
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
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleDelete(project)
                  }}
                  className="absolute left-6 top-6 z-10 rounded-full bg-white/90 p-2 text-red-500 shadow hover:bg-white"
                  aria-label="Eliminar proyecto"
                  disabled={deletingId === project.id}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="aspect-square bg-gray-200 rounded-xl mb-3 overflow-hidden relative">
                  {project.image ? (
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
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

      {editingProject || isCreating ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">
                {isCreating ? "Crear proyecto" : "Editar proyecto"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null)
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
                    <Image
                      src={draft.image}
                      alt={editingProject?.title || String(draft.title || "Proyecto")}
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
                  className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-gold-light hover:text-[#1a1a1a] transition-colors"
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
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Nombre</label>
                <input
                  type="text"
                  value={String(draft.title || "")}
                  onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
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
                    setEditingProject(null)
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
