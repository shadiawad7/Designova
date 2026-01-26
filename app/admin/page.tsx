"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package, ImageIcon, Briefcase, Zap, Home } from "lucide-react"

const sections = [
  {
    id: "products",
    title: "Productos de Tienda",
    description: "Gestiona los productos de la tienda",
    icon: Package,
    href: "/admin/productos",
  },
  {
    id: "graphic-design",
    title: "Diseño gráfico",
    description: "Gestiona los servicios de diseño",
    icon: Briefcase,
    href: "/admin/diseno-grafico",
  },
  {
    id: "portfolio",
    title: "Portafolio",
    description: "Gestiona los proyectos del portafolio",
    icon: ImageIcon,
    href: "/admin/portafolio",
  },
  {
    id: "laser",
    title: "Grabado Láser",
    description: "Gestiona materiales y productos de grabado",
    icon: Zap,
    href: "/admin/laser",
  },
  {
    id: "homepage",
    title: "Página de Inicio",
    description: "Gestiona los proyectos destacados",
    icon: Home,
    href: "/admin/inicio",
  },
]

export default function AdminPage() {
  return (
    <div className="bg-cream min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al sitio
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-2 text-[#1a1a1a]">Panel de Administración</h1>
        <p className="text-muted-foreground mb-8">
          Gestiona el contenido de tu sitio web: imágenes, descripciones y precios.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={section.href}
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow border border-border"
            >
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                <section.icon className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">{section.title}</h2>
              <p className="text-muted-foreground text-sm">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
