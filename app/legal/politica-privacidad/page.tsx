export default function PoliticaPrivacidadPage() {
  return (
    <div className="bg-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#1a1a1a]">Política de Privacidad</h1>
        
        <div className="bg-white rounded-2xl p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">1. Responsable del tratamiento</h2>
            <p className="text-muted-foreground leading-relaxed">
              DESIGNOVA es el responsable del tratamiento de los datos personales que el usuario proporcione 
              a través de este sitio web. Contacto: designova.studio01@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">2. Datos que recopilamos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Recopilamos los datos personales que nos proporciona voluntariamente a través de formularios 
              de contacto, pedidos o suscripciones:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Dirección postal (para envíos)</li>
              <li>Información de pago (procesada de forma segura)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">3. Finalidad del tratamiento</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sus datos personales serán tratados con las siguientes finalidades:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Gestionar sus pedidos y solicitudes de diseño</li>
              <li>Responder a sus consultas y comunicaciones</li>
              <li>Enviar información sobre nuestros servicios (con su consentimiento)</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">4. Conservación de datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los datos personales se conservarán mientras se mantenga la relación comercial y durante el 
              plazo exigido por las obligaciones legales aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">5. Derechos del usuario</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tiene derecho a acceder, rectificar y suprimir sus datos, así como otros derechos explicados 
              en la información adicional. Puede ejercer sus derechos contactando con nosotros en 
              designova.studio01@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">6. Seguridad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger sus 
              datos personales contra el acceso no autorizado, la alteración, divulgación o destrucción.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
