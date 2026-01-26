"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { ArrowRight, Edit3, FileCheck, RefreshCw, DollarSign, Truck, Upload, X } from "lucide-react"

interface GraphicService {
  id: string
  title: string
  description: string
  price: number
  image?: string
  mediaType?: "image" | "video"
}

interface Project {
  id: number
  title: string
  category: string
  description: string
  price: number
  image?: string
  mediaType?: "image" | "video"
}

const defaultServices: GraphicService[] = [
  {
    id: "service-1",
    title: "Diseño de publicaciones para redes sociales",
    description: "Post instagram, Story instagram",
    price: 45,
  },
  {
    id: "service-2",
    title: "Roll-ups y banners",
    description: "Diseño de roll-ups, para ferias, eventos y puntos de venta",
    price: 90,
  },
  {
    id: "service-3",
    title: "Vallas publicitarias y señalización",
    description: "Diseño de carteles, pendones, vinilos, rótulos comerciales y publicidad exterior",
    price: 150,
  },
  {
    id: "service-4",
    title: "Pegatinas y material publicitario",
    description: "Diseño de pegatinas personalizadas, para productos y marca alternativa",
    price: 60,
  },
  {
    id: "service-5",
    title: "Tarjetas de visita",
    description: "Diseño de tarjetas de visita profesionales y modernas - tu primera impresión",
    price: 40,
  },
  {
    id: "service-6",
    title: "Más productos de imprenta",
    description: "Folletos, catálogos, flyers, menús y más",
    price: 70,
  },
]

const defaultProjects: Project[] = Array(12).fill(null).map((_, i) => ({
  id: i + 1,
  title: "Diseño grafico",
  category: ["Invitaciones", "Grabado", "Diseño gráfico"][i % 3],
  description: "Proyecto personalizado con detalles a medida.",
  price: 50 + (i % 4) * 25,
}))

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
  const { data } = useSWR<{ services: GraphicService[] }>("/api/content/graphic-design", fetcher)
  const { data: portfolioData } = useSWR<{ projects: Project[] }>("/api/content/portfolio", fetcher)
  const [services, setServices] = useState<GraphicService[]>(defaultServices)
  const [portfolioProjects, setPortfolioProjects] = useState<Project[]>(defaultProjects)
  const [editingService, setEditingService] = useState<GraphicService | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [draft, setDraft] = useState<Partial<GraphicService>>({})
  const [projectDraft, setProjectDraft] = useState<Partial<Project>>({})
  const [saving, setSaving] = useState(false)
  const [projectSaving, setProjectSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [projectUploading, setProjectUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const projectFileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (data?.services) {
      setServices(data.services)
    }
  }, [data?.services])

  useEffect(() => {
    if (portfolioData?.projects) {
      setPortfolioProjects(portfolioData.projects)
    }
  }, [portfolioData?.projects])

  const handleOpenServiceEdit = (service: GraphicService) => {
    setEditingService(service)
    setDraft({
      description: service.description || "",
      price: service.price,
      image: service.image,
      mediaType: service.mediaType,
    })
  }

  const handleOpenProjectEdit = (project: Project) => {
    setEditingProject(project)
    setProjectDraft({
      description: project.description || "",
      price: project.price,
      image: project.image,
      mediaType: project.mediaType,
    })
  }

  const handleServiceMediaUpload = async (file: File) => {
    setUploading(true)
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
          mediaType: file.type.startsWith("video/") ? "video" : "image",
        }))
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setProjectUploading(false)
  }

  const handleSaveServiceEdit = async () => {
    if (!editingService) return
    setSaving(true)
    const updatedServices = services.map((service) =>
      service.id === editingService.id
        ? {
            ...service,
            description: String(draft.description || ""),
            price: Number(draft.price || 0),
            image: draft.image,
            mediaType: draft.mediaType,
          }
        : service
    )

    try {
      await fetch("/api/content/graphic-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: updatedServices }),
      })
      setServices(updatedServices)
      setEditingService(null)
    } catch (error) {
      console.error("Save failed:", error)
      alert("Error al guardar los cambios")
    }
    setSaving(false)
  }

  const handleSaveProjectEdit = async () => {
    if (!editingProject) return
    setProjectSaving(true)
    const updatedProjects = portfolioProjects.map((project) =>
      project.id === editingProject.id
        ? {
            ...project,
            description: String(projectDraft.description || ""),
            price: Number(projectDraft.price || 0),
            image: projectDraft.image,
            mediaType: projectDraft.mediaType,
          }
        : project
    )

    try {
      await fetch("/api/content/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: updatedProjects }),
      })
      setPortfolioProjects(updatedProjects)
      setEditingProject(null)
    } catch (error) {
      console.error("Save failed:", error)
      alert("Error al guardar los cambios")
    }
    setProjectSaving(false)
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
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                  {service.image ? (
                    service.mediaType === "video" ? (
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
                    )
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
                <p className="text-sm text-[#1a1a1a] mb-4">Desde {service.price} €</p>
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
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                  {service.image ? (
                    service.mediaType === "video" ? (
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
                    )
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
                <p className="text-sm text-[#1a1a1a] mb-4">Desde {service.price} €</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolioProjects.slice(0, 12).map((work) => (
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
                <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden relative">
                  {work.image ? (
                    work.mediaType === "video" ? (
                      <video
                        src={work.image}
                        className="h-full w-full object-cover"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <Image
                        src={work.image || "/placeholder.svg"}
                        alt={work.title}
                        fill
                        className="object-cover"
                      />
                    )
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

      {editingService ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Editar servicio</h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
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
                        alt={editingService.title}
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
                    if (file) handleServiceMediaUpload(file)
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
                  onClick={() => setEditingService(null)}
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

      {editingProject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Editar trabajo</h3>
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
                  {projectDraft.image ? (
                    projectDraft.mediaType === "video" ? (
                      <video
                        src={projectDraft.image}
                        className="h-full w-full object-cover"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <Image
                        src={projectDraft.image}
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
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) handleProjectMediaUpload(file)
                  }}
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
                  onClick={() => setEditingProject(null)}
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
