"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import useSWR, { useSWRConfig } from "swr"
import { ShoppingCart, Menu, X, Edit3 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useEffect, useRef, useState } from "react"

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/invitaciones", label: "Invitaciones para eventos" },
  { href: "/grabado-laser", label: "Grabado láser" },
  { href: "/diseno-grafico", label: "Diseño gráfico" },
  { href: "/portafolio", label: "Portfolio" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/contacto", label: "Contacto" },
]

export function Header() {
  const { totalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { mutate } = useSWRConfig()
  const { data } = useSWR<{ heroAssets?: { logo?: string }; projects?: { id: number; title: string; image?: string }[] }>(
    "/api/content/homepage",
    (url) => fetch(url).then((res) => res.json())
  )
  const logoUrl = data?.heroAssets?.logo
  const [localLogoUrl, setLocalLogoUrl] = useState<string | undefined>(undefined)
  const [savingLogo, setSavingLogo] = useState(false)
  const logoInputRef = useRef<HTMLInputElement | null>(null)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  useEffect(() => {
    if (logoUrl) {
      setLocalLogoUrl(logoUrl)
    }
  }, [logoUrl])

  const handleLogoUpload = async (file: File) => {
    setSavingLogo(true)
    try {
      const currentData =
        data ||
        (await fetch("/api/content/homepage").then((res) => res.json())) ||
        {}
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "homepage/hero")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        const nextHeroAssets = { ...(currentData.heroAssets || {}), logo: url }
        await fetch("/api/content/homepage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects: currentData.projects || [], heroAssets: nextHeroAssets }),
        })
        setLocalLogoUrl(url)
        mutate("/api/content/homepage")
      }
    } catch (error) {
      console.error("Logo upload failed:", error)
      alert("Error al subir el logo")
    }
    setSavingLogo(false)
  }

  return (
    <header className="bg-gold text-[#1a1a1a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              {localLogoUrl ? (
                <div className="relative h-9 w-28">
                  <Image
                    src={localLogoUrl}
                    alt="Designova"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 bg-[#1a1a1a] rounded flex items-center justify-center">
                    <span className="text-gold font-bold text-xs">D</span>
                  </div>
                  <span className="text-[#1a1a1a] font-semibold text-sm tracking-wide">DESIGNOVA</span>
                </>
              )}
            </Link>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="rounded-full bg-black/10 p-1 text-[#1a1a1a] hover:bg-black/20"
              aria-label="Subir logo"
              disabled={savingLogo}
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) handleLogoUpload(file)
              }}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors whitespace-nowrap ${
                  isActive(item.href)
                    ? "text-[#1a1a1a] font-semibold border-b-2 border-[#1a1a1a] pb-1"
                    : "text-[#1a1a1a]/90 hover:text-[#1a1a1a]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href="/carrito" className="relative">
              <ShoppingCart className="w-5 h-5 text-[#1a1a1a] hover:text-[#1a1a1a] transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1a1a1a] text-gold text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden text-[#1a1a1a]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-gold border-t border-black/10 px-4 py-4">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm py-2 transition-colors ${
                  isActive(item.href)
                    ? "text-[#1a1a1a] font-semibold"
                    : "text-[#1a1a1a]/90 hover:text-[#1a1a1a]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
