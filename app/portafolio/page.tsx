"use client"

import { useState } from "react"
import Image from "next/image"
import useSWR from "swr"

interface Project {
  id: number
  title: string
  category: string
  image?: string
}

const defaultProjects: Project[] = Array(16).fill(null).map((_, i) => ({
  id: i + 1,
  title: "Diseño grafico",
  category: ["Invitaciones", "Grabado", "Diseño gráfico"][i % 3],
}))

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function PortafolioPage() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const { data } = useSWR<{ projects: Project[] }>("/api/content/portfolio", fetcher)
  
  const projects = data?.projects || defaultProjects

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
              <button
                key={project.id}
                onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                className="text-left"
              >
                <div
                  className={`bg-cream-dark rounded-2xl p-4 transition-all ${
                    selectedProject === project.id ? "ring-2 ring-gold" : "hover:shadow-lg"
                  }`}
                >
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
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
