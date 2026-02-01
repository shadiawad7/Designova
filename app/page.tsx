"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, Edit3, Upload } from "lucide-react"
import useSWR from "swr"

interface Project {
  id: number
  title: string
  image?: string
}

interface HeroAssets {
  logo?: string
  left?: string
  right?: string
}

const services = [
  {
    title: "Invitaciones para eventos",
    description: "Invitaciones para bodas, celebraciones, cumpleaños y eventos especiales - con diseño personal y único.",
    href: "/invitaciones",
    icon: "envelope",
  },
  {
    title: "Diseño gráfico",
    description: "Fotocalls, posts, tarjetas de visita, roll-ups, carteles, pegatinas y eventos especiales con diseño personal y único.",
    href: "/diseno-grafico",
    icon: "pen",
  },
  {
    title: "Grabado láser",
    description: "Grabado en madera, acrílico y otros materiales - regalos personales con significado.",
    href: "/grabado-laser",
    icon: "laser",
  },
]

const steps = [
  { number: "1", title: "Eliges el diseño o producto" },
  { number: "2", title: "Envías detalles y personalizaciones" },
  { number: "3", title: "Recibes aprobación del diseño" },
  { number: "4", title: "Pagas online" },
  { number: "5", title: "Producimos y enviamos" },
]

const defaultProjects: Project[] = [
  { id: 1, title: "Diseño grafico" },
  { id: 2, title: "Diseño grafico" },
  { id: 3, title: "Diseño grafico" },
  { id: 4, title: "Diseño grafico" },
]

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HomePage() {
  const { data } = useSWR<{ projects: Project[]; heroAssets?: HeroAssets }>("/api/content/homepage", fetcher)
  const projects = data?.projects || defaultProjects
  const [heroAssets, setHeroAssets] = useState<HeroAssets>({})
  const [savingHero, setSavingHero] = useState(false)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    if (data?.heroAssets) {
      setHeroAssets(data.heroAssets)
    }
  }, [data?.heroAssets])

  const handleHeroUpload = async (slot: keyof HeroAssets, file: File) => {
    setSavingHero(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "homepage/hero")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        const nextHeroAssets = { ...heroAssets, [slot]: url }
        setHeroAssets(nextHeroAssets)
        await fetch("/api/content/homepage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects, heroAssets: nextHeroAssets }),
        })
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Error al subir la imagen")
    }
    setSavingHero(false)
  }

  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-[#0e0e0e] px-6 py-12 md:px-10 md:py-16">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
              <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
            </div>
            <div className="relative grid gap-10 md:grid-cols-[1.1fr_1.8fr_1.1fr] items-center">
              {/* Left collage */}
              <div className="hidden md:block">
                <div className="relative h-full rounded-2xl border border-white/10 bg-black/60 p-3 shadow-lg">
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current.left?.click()}
                    className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-[#1a1a1a] shadow hover:bg-white"
                    aria-label="Editar imagen izquierda"
                    disabled={savingHero}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <div className="aspect-[3/5] rounded-xl bg-[#111] overflow-hidden relative">
                    {heroAssets.left ? (
                      <Image
                        src={heroAssets.left}
                        alt="Imagen izquierda"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#2a2a2a] to-[#111]" />
                    )}
                  </div>
                  <input
                    ref={(el) => { fileInputRefs.current.left = el }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) handleHeroUpload("left", file)
                    }}
                  />
                </div>
              </div>

              {/* Center text */}
              <div className="text-center">
                <p className="text-gold text-sm md:text-base mb-4 tracking-[0.2em] uppercase">
                  Bienvenidos a DESIGNOVA
                </p>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="h-px w-16 bg-gold/60" />
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  <span className="h-px w-16 bg-gold/60" />
                </div>
                <h1 className="text-gold text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                  Diseñamos momentos
                </h1>
                <h2 className="text-gold text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Creamos recuerdos
                </h2>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="h-px w-16 bg-gold/60" />
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  <span className="h-px w-16 bg-gold/60" />
                </div>
                <p className="text-white/70 mb-8 max-w-lg mx-auto">
                  Estudio de diseño personalizado para invitaciones y productos únicos.
                </p>
                <Link
                  href="/tienda"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors"
                >
                  comenzar <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right collage */}
              <div className="hidden md:block">
                <div className="relative h-full rounded-2xl border border-white/10 bg-black/60 p-3 shadow-lg">
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current.right?.click()}
                    className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-[#1a1a1a] shadow hover:bg-white"
                    aria-label="Editar imagen derecha"
                    disabled={savingHero}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <div className="aspect-[3/5] rounded-xl bg-[#111] overflow-hidden relative">
                    {heroAssets.right ? (
                      <Image
                        src={heroAssets.right}
                        alt="Imagen derecha"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#3a3a3a] to-[#111]" />
                    )}
                  </div>
                  <input
                    ref={(el) => { fileInputRefs.current.right = el }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) handleHeroUpload("right", file)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1a1a1a]">
            Nuestros diseños
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-cream-dark rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-cream rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gold/20 rounded-full" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[#1a1a1a] underline decoration-gold underline-offset-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                >
                  Mas información <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-cream-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1a1a1a]">
            ¿Cómo funciona ?
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {steps.map((step) => (
              <div key={step.number} className="text-center max-w-[140px]">
                <div className="w-16 h-16 bg-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-[#1a1a1a] text-2xl font-bold">{step.number}</span>
                </div>
                <p className="text-sm text-[#1a1a1a]">{step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Projects */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">
              Proyectos seleccionados
            </h2>
            <Link
              href="/portafolio"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              Ver mas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="group">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-2 overflow-hidden relative">
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
                <p className="text-sm text-[#1a1a1a]">{project.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gold">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a1a]">
            ¿Listos para crear algo especial ?
          </h2>
          <p className="text-[#1a1a1a]/80 mb-8 max-w-2xl mx-auto">
            Vamos a crear juntos el diseño perfecto que hará de tu evento algo inolvidable.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Contáctanos ahora <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
