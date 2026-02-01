"use client"

import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"

const quickLinks = [
  { href: "/tienda", label: "Tienda" },
  { href: "/invitaciones", label: "Invitaciones para eventos" },
  { href: "/grabado-laser", label: "Grabado láser" },
  { href: "/diseno-grafico", label: "Diseño gráfico" },
  { href: "/portafolio", label: "Portfolio" },
]

const infoLinks = [
  { href: "/legal/aviso-legal", label: "Aviso legal" },
  { href: "/legal/politica-privacidad", label: "Política de privacidad" },
  { href: "/legal/politica-cookies", label: "Política de cookies" },
  { href: "/legal/terminos-condiciones", label: "Términos y condiciones" },
  { href: "/legal/envios-devoluciones", label: "Envíos y devoluciones" },
]

export function Footer() {
  const { data } = useSWR<{ items: { id: string; foto: string | null }[] }>(
    "/api/logo",
    (url) => fetch(url).then((res) => res.json())
  )
  const logoUrl = data?.items?.[0]?.foto || undefined

  return (
    <footer className="bg-[#1a1a1a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {logoUrl ? (
                <div className="relative h-10 w-32">
                  <Image
                    src={logoUrl}
                    alt="Designova"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
                    <span className="text-[#1a1a1a] font-bold text-xs">D</span>
                  </div>
                  <span className="text-gold font-semibold tracking-wide">DESIGNOVA</span>
                </>
              )}
            </div>
            <p className="text-white/70 text-sm mb-1">Diseñamos Momentos</p>
            <p className="text-white/70 text-sm">Creamos Recuerdos</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Información</h3>
            <ul className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contacto</h3>
            <div className="space-y-2 text-sm text-white/70">
              <p>Chat por Whatsapp: +34648840097</p>
              <p>Email: designova.studio01@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-white/50 text-sm">
            2026 DESIGNOVA - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
