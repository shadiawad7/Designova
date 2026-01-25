import Link from "next/link"
import { ArrowRight, FileCheck, RefreshCw, DollarSign, Truck } from "lucide-react"

const services = [
  {
    title: "Diseño de publicaciones para redes sociales",
    description: "Post instagram, Story instagram",
    href: "/contacto",
  },
  {
    title: "Roll-ups y banners",
    description: "Diseño de roll-ups, para ferias, eventos y puntos de venta",
    href: "/contacto",
  },
  {
    title: "Vallas publicitarias y señalización",
    description: "Diseño de carteles, pendones, vinilos, rótulos comerciales y publicidad exterior",
    href: "/contacto",
  },
  {
    title: "Pegatinas y material publicitario",
    description: "Diseño de pegatinas personalizadas, para productos y marca alternativa",
    href: "/contacto",
  },
  {
    title: "Tarjetas de visita",
    description: "Diseño de tarjetas de visita profesionales y modernas - tu primera impresión",
    href: "/contacto",
  },
  {
    title: "Más productos de imprenta",
    description: "Folletos, catálogos, flyers, menús y más",
    href: "/contacto",
  },
]

const workExamples = Array(12).fill({ title: "Diseño grafico", subtitle: "Desde" })

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
                key={service.title}
                className="bg-white rounded-2xl p-6 text-center"
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gray-300" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#1a1a1a]">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                <Link
                  href={service.href}
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
                key={service.title}
                className="bg-white rounded-2xl p-6 text-center"
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gray-300" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#1a1a1a]">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                <Link
                  href={service.href}
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
            {workExamples.map((work, index) => (
              <div key={index} className="group">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                  <div className="w-full h-full bg-gray-300" />
                </div>
                <p className="text-sm text-[#1a1a1a]">{work.title}</p>
                <p className="text-xs text-muted-foreground">{work.subtitle}</p>
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
    </div>
  )
}
