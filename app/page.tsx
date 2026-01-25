"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import useSWR from "swr"

interface Project {
  id: number
  title: string
  image?: string
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

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function HomePage() {
  const { data } = useSWR<{ projects: Project[] }>("/api/content/homepage", fetcher)
  const projects = data?.projects || defaultProjects

  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1a1a1a] rounded-3xl p-10 md:p-16 text-center">
            <p className="text-gold text-sm md:text-base mb-4">Bienvenidos a DESIGNOVA</p>
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              Diseñamos momentos
            </h1>
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Creamos recuerdos
            </h2>
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
