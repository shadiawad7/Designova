import { Heart, Award, Users, Camera } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Amor por los detalles",
    description: "Creemos que los pequeños detalles son los que crean la gran experiencia. Cada diseño recibe toda nuestra atención.",
  },
  {
    icon: Award,
    title: "Calidad sin compromisos",
    description: "Trabajamos solo con los mejores materiales y la tecnología más avanzada para garantizar un resultado perfecto.",
  },
  {
    icon: Users,
    title: "Servicio personal",
    description: "Cada cliente es un mundo entero. Te acompañamos en cada paso, desde la idea hasta el producto terminado.",
  },
]

export default function SobreNosotrosPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Header Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1a1a1a]">
            Un poco sobre nosotros
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            DESIGNOVA nació del amor por el diseño, los pequeños detalles y los grandes momentos de la vida. 
            Combinamos creatividad, tecnología y precisión para transformar ideas en productos emocionantes y únicos.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4 bg-cream-dark">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="bg-gray-200 rounded-2xl aspect-[4/3] flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gold mx-auto mb-4" />
                <p className="text-muted-foreground">Imagen del estudio</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a1a1a]">
                Nuestra historia
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Todo comenzó con una verdadera pasión por el diseño y la innovación. Entendíamos que cada evento, 
                  cada momento importante en la vida, merece un diseño que cuente su historia única.
                </p>
                <p>
                  Hoy, DESIGNOVA es un estudio de diseño completo que combina habilidades gráficas avanzadas con 
                  tecnología de grabado láser preciso. Estamos orgullosos de nuestra capacidad de tomar cualquier idea, 
                  cualquier sueño, y convertirlo en una realidad tangible y hermosa.
                </p>
                <p>
                  Cada proyecto que hacemos es nuevo, emocionante y desafiante. No dejamos de aprender, 
                  desarrollar e innovar, porque sabemos que nuestros clientes vienen a nosotros con los momentos 
                  más importantes de sus vidas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1a1a1a]">
            Nuestros valores
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-cream-dark rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-gold/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-[#1a1a1a] underline decoration-gold underline-offset-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
