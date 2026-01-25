"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR, { mutate } from "swr"
import { ArrowLeft, Plus, Trash2, Upload, Save, X } from "lucide-react"

interface Project {
  id: number
  title: string
  category: string
  image?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminPortfolioPage() {
  const { data, isLoading } = useSWR<{ projects: Project[] }>("/api/content/portfolio", fetcher)
  const [projects, setProjects] = useState<Project[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  if (data?.projects && projects.length === 0) {
    setProjects(data.projects)
  }

  const handleImageUpload = async (projectId: number, file: File) => {
    setUploading(projectId)
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
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, image: url } : p))
        )
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setUploading(null)
  }

  const handleRemoveImage = async (projectId: number, imageUrl?: string) => {
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
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, image: undefined } : p))
    )
  }

  const handleUpdateProject = (projectId: number, field: keyof Project, value: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, [field]: value } : p))
    )
  }

  const handleAddProject = () => {
    const newId = Date.now()
    setProjects((prev) => [
      ...prev,
      { id: newId, title: "Nuevo proyecto", category: "Diseño gráfico" },
    ])
  }

  const handleDeleteProject = (projectId: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/content/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      })
      mutate("/api/content/portfolio")
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
            <h1 className="text-3xl font-bold text-[#1a1a1a]">Portafolio</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddProject}
              className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Añadir proyecto
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl p-4">
              {/* Image Section */}
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative mb-3">
                {project.image ? (
                  <>
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(project.id, project.image)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => fileInputRefs.current[project.id]?.click()}
                    className="w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-[#1a1a1a] transition-colors"
                    disabled={uploading === project.id}
                  >
                    {uploading === project.id ? (
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
                ref={(el) => { fileInputRefs.current[project.id] = el }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(project.id, file)
                }}
              />

              {/* Fields */}
              <input
                type="text"
                value={project.title}
                onChange={(e) => handleUpdateProject(project.id, "title", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold mb-2"
                placeholder="Título"
              />
              <div className="flex items-center gap-2">
                <select
                  value={project.category}
                  onChange={(e) => handleUpdateProject(project.id, "category", e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="Invitaciones">Invitaciones</option>
                  <option value="Grabado">Grabado</option>
                  <option value="Diseño gráfico">Diseño gráfico</option>
                </select>
                <button
                  onClick={() => handleDeleteProject(project.id)}
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
