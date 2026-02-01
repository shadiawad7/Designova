"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { ArrowRight, Edit3, FileCheck, RefreshCw, DollarSign, Plus, Truck, Trash2, Upload, X } from "lucide-react"

interface GraphicService {
  id: string
  title: string
  description: string
  image?: string
}

interface Project {
  id: string
  title: string
  description: string
  price: number | null
  image?: string
}

const defaultServices: GraphicService[] = []
const defaultProjects: Project[] = []

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const steps = [
  { number: "1", title: "Consulta", description: "Nos reunimos y entendemos tus necesidades" },
  { number: "2", title: "Presupuesto", description: "Recibes el presupuesto detallado" },
  { number: "3", title: "Diseño", description: "Creamos el diseño perfecto" },
  { number: "4", title: "Archivos listos", description: "Recibe archivos para impresión" },
]

const features = [
  {
    icon: FileCheck,
    title: "Archivos sin marcas",
    description: "Todos los diseños se entregan sin marcas de agua, listos para imprimir",
  },
  {
    icon: RefreshCw,
    title: "Revisiones ilimitadas",
    description: "Realizamos todas las revisiones necesarias hasta que estés completamente satisfecho",
  },
  {
    icon: DollarSign,
    title: "Precios transparentes",
    description: "Presupuestos claros y sin sorpresas",
  },
  {
    icon: Truck,
    title: "Entrega rápida",
    description: "En la mayoría de casos entregamos en 3-5 días laborables",
  },
]

export default function DisenoGraficoPage() {
  const { data } = useSWR<{ items: { id: string; foto: string | null; nombre: string | null; descripcion: string | null }[] }>(
    "/api/nuestros-servicios",
    fetcher
  )
  const { data: trabajosData } = useSWR<{ items: { id: string; foto: string | null; nombre: string | null; descripcion: string | null; precio: number | null }[] }>(
    "/api/ejemplos-trabajos",
    fetcher
  )
  const [services, setServices] = useState<GraphicService[]>(defaultServices)
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [editingService, setEditingService] = useState<GraphicService | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [draft, setDraft] = useState<Partial<GraphicService>>({})
  const [projectDraft, setProjectDraft] = useState<Partial<Project>>({})
  const [saving, setSaving] = useState(false)
  const [projectSaving, setProjectSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [projectUploading, setProjectUploading] = useState(false)
  const [isCreatingService, setIsCreatingService] = useState(false)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null)
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const projectFileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (data?.items) {
      setServices(
        data.items.map((item) => ({
          id: item.id,
          title: item.nombre || "Sin nombre",
          description: item.descripcion || "",
          image: item.foto || undefined,
        }))
      )
    }
  }, [data?.items])

  useEffect(() => {
    if (trabajosData?.items) {
      setProjects(
        trabajosData.items.map((item) => ({
          id: item.id,
          title: item.nombre || "Sin nombre",
          description: item.descripcion || "",
          price: item.precio,
          image: item.foto || undefined,
        }))
      )
    }
  }, [trabajosData?.items])

  const handleOpenServiceEdit = (service: GraphicService) => {
    setEditingService(service)
    setIsCreatingService(false)
    setDraft({
      title: service.title,
      description: service.description || "",
      image: service.image,
    })
  }

  const handleOpenProjectEdit = (project: Project) => {
    setEditingProject(project)
    setIsCreatingProject(false)
    setProjectDraft({
      title: project.title,
      description: project.description || "",
      price: project.price,
      image: project.image,
    })
  }

  const handleServiceMediaUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "nuestros-servicios")

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

  const handleProjectMediaUpload = async (file: File) => {
    setProjectUploading(true)
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
        setProjectDraft((prev) => ({
          ...prev,
          image: url,
        }))
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setProjectUploading(false)
  }

  const handleSaveServiceEdit = async () => {
    if (!editingService && !isCreatingService) return
    setSaving(true)

    try {
      if (isCreatingService) {
        const response = await fetch("/api/nuestros-servicios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: String(draft.title || "Sin nombre"),
            descripcion: String(draft.description || ""),
            foto: draft.image || null,
          }),
        })
        const result = await response.json()
        if (response.ok) {
          const created = result.item
          setServices((prev) => [
            ...prev,
            {
              id: created.id,
              title: created.nombre || "Sin nombre",
              description: created.descripcion || "",
              image: created.foto || undefined,
            },
          ])
          setEditingService(null)
          setIsCreatingService(false)
        } else {
          throw new Error(result.error || "Error al crear el servicio")
        }
      } else if (editingService) {
        const response = await fetch("/api/nuestros-servicios", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingService.id,
            nombre: String(draft.title || "Sin nombre"),
            descripcion: String(draft.description || ""),
            foto: draft.image || null,
          }),
        })
        const result = await response.json()
        if (response.ok) {
          const updated = result.item
          setServices((prev) =>
            prev.map((service) =>
              service.id === updated.id
                ? {
                    ...service,
                    title: updated.nombre || "Sin nombre",
                    description: updated.descripcion || "",
                    image: updated.foto || undefined,
                  }
                : service
            )
          )
          setEditingService(null)
          setIsCreatingService(false)
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

  const handleSaveProjectEdit = async () => {
    if (!editingProject && !isCreatingProject) return
    setProjectSaving(true)

    try {
      if (isCreatingProject) {
        const response = await fetch("/api/ejemplos-trabajos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: String(projectDraft.title || "Sin nombre"),
            descripcion: String(projectDraft.description || ""),
            precio: Number(projectDraft.price || 0),
            foto: projectDraft.image || null,
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
          setIsCreatingProject(false)
        } else {
          throw new Error(result.error || "Error al crear el trabajo")
        }
      } else if (editingProject) {
        const response = await fetch("/api/ejemplos-trabajos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProject.id,
            nombre: String(projectDraft.title || "Sin nombre"),
            descripcion: String(projectDraft.description || ""),
            precio: Number(projectDraft.price || 0),
            foto: projectDraft.image || null,
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
          setIsCreatingProject(false)
        } else {
          throw new Error(result.error || "Error al guardar los cambios")
        }
      }
    } catch (error) {
      console.error("Save failed:", error)
      alert("Error al guardar los cambios")
    }
    setProjectSaving(false)
  }

  const handleDeleteService = async (service: GraphicService) => {
    const confirmed = window.confirm("¿Eliminar este servicio?")
    if (!confirmed) return
    setDeletingServiceId(service.id)
    try {
      const response = await fetch("/api/nuestros-servicios", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: service.id }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar el servicio")
      }
      setServices((prev) => prev.filter((item) => item.id !== service.id))
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Error al eliminar el servicio")
    }
    setDeletingServiceId(null)
  }

  const handleDeleteProject = async (project: Project) => {
    const confirmed = window.confirm("¿Eliminar este trabajo?")
    if (!confirmed) return
    setDeletingProjectId(project.id)
    try {
      const response = await fetch("/api/ejemplos-trabajos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project.id }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar el trabajo")
      }
      setProjects((prev) => prev.filter((item) => item.id !== project.id))
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Error al eliminar el trabajo")
    }
    setDeletingProjectId(null)
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a1a] underline decoration-gold underline-offset-8">
            Diseño gráfico y imprenta
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nos especializamos en diseño gráfico profesional para todo tipo de impresiones y publicidad. Nada importar lo que
            necesites - ofrecemos servicios de diseño solamente, la imprenta queda bajo tu responsabilidad o según solicitud.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors"
            >
              Solicitar presupuesto <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/portafolio"
              className="inline-flex items-center gap-2 border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Ver trabajos realizados <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-cream-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1a1a1a]">
            Nuestro servicios
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Amplia gama de servicios de diseño gráfico profesional para todas las necesidades de tu negocio y publicidad
          </p>
          
          <div className="mb-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setEditingService(null)
                setIsCreatingService(true)
                setDraft({
                  title: "",
                  description: "",
                  image: undefined,
                })
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-gold-light transition-colors"
            >
              <Plus className="h-4 w-4" />
              Crear servicio
            </button>
          </div>

          {services.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
              No hay servicios creados todavía. Usa “Crear servicio” para añadir el primero.
            </div>
          ) : null}

          {/* First Row - 3 items */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 text-center relative"
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleOpenServiceEdit(service)
                  }}
                  className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-[#1a1a1a] shadow hover:bg-white"
                  aria-label="Editar servicio"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleDeleteService(service)
                  }}
                  className="absolute left-4 top-4 z-10 rounded-full bg-white/90 p-2 text-red-500 shadow hover:bg-white"
                  aria-label="Eliminar servicio"
                  disabled={deletingServiceId === service.id}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                  {service.image ? (
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#1a1a1a]">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Hablemos <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Second Row - 3 items */}
          <div className="grid md:grid-cols-3 gap-6">
            {services.slice(3, 6).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 text-center relative"
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleOpenServiceEdit(service)
                  }}
                  className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-[#1a1a1a] shadow hover:bg-white"
                  aria-label="Editar servicio"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleDeleteService(service)
                  }}
                  className="absolute left-4 top-4 z-10 rounded-full bg-white/90 p-2 text-red-500 shadow hover:bg-white"
                  aria-label="Eliminar servicio"
                  disabled={deletingServiceId === service.id}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                  {service.image ? (
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#1a1a1a]">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Hablemos <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Examples */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1a1a1a]">
            Ejemplos de nuestros trabajos
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Una vista de algunos proyectos que diseñamos para nuestros clientes
          </p>
          <div className="mb-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setEditingProject(null)
                setIsCreatingProject(true)
                setProjectDraft({
                  title: "",
                  description: "",
                  price: 0,
                  image: undefined,
                })
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-gold-light transition-colors"
            >
              <Plus className="h-4 w-4" />
              Crear trabajo
            </button>
          </div>
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
              No hay trabajos creados todavía. Usa “Crear trabajo” para añadir el primero.
            </div>
          ) : null}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {projects.slice(0, 12).map((work) => (
              <div key={work.id} className="group relative">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleOpenProjectEdit(work)
                  }}
                  className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-2 text-[#1a1a1a] shadow hover:bg-white"
                  aria-label="Editar trabajo"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleDeleteProject(work)
                  }}
                  className="absolute left-2 top-2 z-10 rounded-full bg-white/90 p-2 text-red-500 shadow hover:bg-white"
                  aria-label="Eliminar trabajo"
                  disabled={deletingProjectId === work.id}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden relative">
                  {work.image ? (
                    <Image
                      src={work.image || "/placeholder.svg"}
                      alt={work.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>
                <p className="text-sm text-[#1a1a1a]">{work.title}</p>
                {work.description ? (
                  <p className="text-xs text-muted-foreground">{work.description}</p>
                ) : null}
                {work.price != null ? (
                  <p className="text-xs text-muted-foreground">Desde {work.price} €</p>
                ) : null}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/portafolio"
              className="inline-flex items-center gap-2 border-2 border-gold text-[#1a1a1a] hover:bg-gold px-6 py-3 rounded-full font-medium transition-colors"
            >
              Ver todos los trabajos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-cream-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1a1a1a]">
            ¿Cómo funciona el proceso?
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {steps.map((step) => (
              <div key={step.number} className="text-center max-w-[140px]">
                <div className="w-16 h-16 border-2 border-gold rounded-full mx-auto mb-4 flex items-center justify-center bg-white">
                  <span className="text-[#1a1a1a] text-2xl font-bold">{step.number}</span>
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1a1a1a]">
            ¿Por qué elegirnos ?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-12 h-12 bg-gold/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2 underline decoration-gold underline-offset-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gold">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a1a]">
            ¿Listo para comenzar?
          </h2>
          <p className="text-[#1a1a1a]/80 mb-8">
            Cuéntanos sobre tu proyecto y te responderemos con un presupuesto en 24 horas
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Contáctanos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {editingService || isCreatingService ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">
                {isCreatingService ? "Crear servicio" : "Editar servicio"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingService(null)
                  setIsCreatingService(false)
                }}
                className="rounded-full p-1 text-muted-foreground hover:text-[#1a1a1a]"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-border p-3">
                <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100 relative">
                  {draft.image ? (
                    <Image
                      src={draft.image}
                      alt={editingService?.title || String(draft.title || "Servicio")}
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
                  {uploading ? "Subiendo..." : "Subir foto o video"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) handleServiceMediaUpload(file)
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
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null)
                    setIsCreatingService(false)
                  }}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-cream-dark transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveServiceEdit}
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

      {editingProject || isCreatingProject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">
                {isCreatingProject ? "Crear trabajo" : "Editar trabajo"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null)
                  setIsCreatingProject(false)
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
                  {projectDraft.image ? (
                    <Image
                      src={projectDraft.image}
                      alt={editingProject?.title || String(projectDraft.title || "Trabajo")}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => projectFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors"
                  disabled={projectUploading}
                >
                  <Upload className="h-4 w-4" />
                  {projectUploading ? "Subiendo..." : "Subir foto o video"}
                </button>
                <input
                  ref={projectFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) handleProjectMediaUpload(file)
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Nombre</label>
                <input
                  type="text"
                  value={String(projectDraft.title || "")}
                  onChange={(event) => setProjectDraft((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Descripción</label>
                <textarea
                  value={String(projectDraft.description || "")}
                  onChange={(event) => setProjectDraft((prev) => ({ ...prev, description: event.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Precio (€)</label>
                <input
                  type="number"
                  value={projectDraft.price ?? 0}
                  onChange={(event) => setProjectDraft((prev) => ({ ...prev, price: Number(event.target.value) }))}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null)
                    setIsCreatingProject(false)
                  }}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-cream-dark transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveProjectEdit}
                  disabled={projectSaving}
                  className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-gold-light transition-colors disabled:opacity-60"
                >
                  {projectSaving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
