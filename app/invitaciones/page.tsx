import Link from "next/link"
import { ArrowRight, Palette, Award, Truck } from "lucide-react"

const invitationTypes = [
  {
    title: "Invitaciones de boda",
    description: "Diseños elegantes y personalizados para celebrar uno de los días más importantes de tu vida.",
    href: "/contacto",
  },
  {
    title: "Invitaciones de cumpleaños",
    description: "Invitaciones creativas y originales para cumpleaños infantiles, juveniles y de adultos.",
    href: "/contacto",
  },
  {
    title: "Invitaciones de bautizo",
    description: "Diseños delicados y emotivos para celebrar un momento único en familia.",
    href: "/contacto",
  },
  {
    title: "Invitaciones de primera comunión",
    description: "Invitaciones cuidadas y especiales para una celebración tradicional llena de significado.",
    href: "/contacto",
  },
  {
    title: "Invitaciones corporativas",
    description: "Diseño profesional de invitaciones para eventos de empresa, lanzamientos y celebraciones corporativas.",
    href: "/contacto",
  },
  {
    title: "Invitaciones para eventos especiales",
    description: "Invitaciones únicas para aniversarios, baby showers, despedidas y todo tipo de celebraciones especiales.",
    href: "/contacto",
  },
  {
    title: "Invitaciones personalizadas",
    description: "¿Tienes una idea en mente? Creamos invitaciones totalmente personalizadas, adaptadas a tu estilo y ocasión.",
    href: "/contacto",
  },
]

const features = [
  {
    icon: Palette,
    title: "Diseño personalizado",
    description: "Cada invitación adaptada especialmente para ti",
  },
  {
    icon: Award,
    title: "Calidad premium",
    description: "Materiales de calidad e impresión de máximo nivel",
  },
  {
    icon: Truck,
    title: "Envío rápido",
    description: "Tiempos de entrega cortos sin comprometer la calidad",
  },
]

export default function InvitacionesPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="bg-gold py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a1a]">
            Invitaciones para eventos<br />con diseño personal
          </h1>
          <p className="text-[#1a1a1a]/80 mb-8 max-w-2xl mx-auto">
            Cada evento es una historia. En DESIGNOVA creamos invitaciones que cuentan tu historia,
            con diseño preciso, elegante y emocionante.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Comenzar diseño <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Types of Invitations */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1a1a1a]">
            Tipos de invitaciones
          </h2>
          
          {/* First Row - 3 items */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {invitationTypes.slice(0, 3).map((type) => (
              <div
                key={type.title}
                className="bg-cream-dark rounded-full p-8 text-center aspect-square flex flex-col items-center justify-center"
              >
                <h3 className="font-semibold text-lg mb-3 text-[#1a1a1a] underline decoration-gold underline-offset-4">
                  {type.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed px-4">
                  {type.description}
                </p>
                <Link
                  href={type.href}
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Detalles y pedido <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Second Row - 3 items */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {invitationTypes.slice(3, 6).map((type) => (
              <div
                key={type.title}
                className="bg-cream-dark rounded-full p-8 text-center aspect-square flex flex-col items-center justify-center"
              >
                <h3 className="font-semibold text-lg mb-3 text-[#1a1a1a] underline decoration-gold underline-offset-4">
                  {type.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed px-4">
                  {type.description}
                </p>
                <Link
                  href={type.href}
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Detalles y pedido <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Third Row - 1 centered item */}
          <div className="flex justify-center">
            <div className="bg-cream-dark rounded-full p-8 text-center aspect-square flex flex-col items-center justify-center max-w-sm">
              <h3 className="font-semibold text-lg mb-3 text-[#1a1a1a] underline decoration-gold underline-offset-4">
                {invitationTypes[6].title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed px-4">
                {invitationTypes[6].description}
              </p>
              <Link
                href={invitationTypes[6].href}
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Detalles y pedido <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-cream-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1a1a1a]">
            ¿Por qué elegirnos ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#1a1a1a] underline decoration-gold underline-offset-4">
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
            ¿Listos para comenzar ?
          </h2>
          <p className="text-[#1a1a1a]/80 mb-8">
            Contáctanos y empezaremos juntos a crear tus invitaciones perfectas
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
