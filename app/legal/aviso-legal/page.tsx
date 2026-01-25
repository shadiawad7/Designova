export default function AvisoLegalPage() {
  return (
    <div className="bg-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#1a1a1a]">Aviso Legal</h1>
        
        <div className="bg-white rounded-2xl p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">1. Datos identificativos</h2>
            <p className="text-muted-foreground leading-relaxed">
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la 
              Información y Comercio Electrónico, se informa que DESIGNOVA es un estudio de diseño ubicado en 
              Calle del diseño 10, Valencia, España.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Email de contacto: designova.studio01@gmail.com<br />
              Teléfono: +34 648 840 097
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">2. Objeto</h2>
            <p className="text-muted-foreground leading-relaxed">
              El presente aviso legal regula el uso y utilización del sitio web www.designova.es, del que es 
              titular DESIGNOVA. La navegación por el sitio web atribuye la condición de usuario del mismo e 
              implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas 
              en este Aviso Legal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">3. Propiedad intelectual e industrial</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todos los contenidos del sitio web, incluyendo textos, fotografías, gráficos, imágenes, iconos, 
              tecnología, software, así como el diseño gráfico y códigos fuente, constituyen una obra cuya 
              propiedad pertenece a DESIGNOVA, sin que puedan entenderse cedidos al usuario ninguno de los 
              derechos de explotación sobre los mismos más allá de lo estrictamente necesario para el correcto 
              uso de la web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">4. Responsabilidad</h2>
            <p className="text-muted-foreground leading-relaxed">
              DESIGNOVA no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran 
              ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad 
              del portal o la transmisión de virus o programas maliciosos en los contenidos, a pesar de haber 
              adoptado todas las medidas tecnológicas necesarias para evitarlo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">5. Legislación aplicable</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio 
              web o de las actividades en él desarrolladas, será de aplicación la legislación española, a la 
              que se someten expresamente las partes, siendo competentes para la resolución de todos los 
              conflictos derivados o relacionados con su uso los Juzgados y Tribunales de Valencia.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
