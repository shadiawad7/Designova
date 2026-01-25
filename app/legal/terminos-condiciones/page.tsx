export default function TerminosCondicionesPage() {
  return (
    <div className="bg-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#1a1a1a]">Términos y Condiciones</h1>
        
        <div className="bg-white rounded-2xl p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">1. Condiciones generales</h2>
            <p className="text-muted-foreground leading-relaxed">
              Estos términos y condiciones regulan la relación entre DESIGNOVA y los clientes que contratan 
              nuestros servicios de diseño gráfico, invitaciones personalizadas y grabado láser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">2. Proceso de pedido</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>El cliente selecciona el producto o servicio deseado</li>
              <li>Proporciona los detalles de personalización requeridos</li>
              <li>DESIGNOVA envía una propuesta de diseño para su aprobación</li>
              <li>Una vez aprobado el diseño, se procede al pago</li>
              <li>Se realiza la producción y envío del producto</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">3. Precios y pagos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los precios mostrados en la web incluyen IVA. El pago se realiza una vez aprobado el diseño 
              final. Aceptamos transferencia bancaria y pago con tarjeta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">4. Revisiones de diseño</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cada pedido incluye hasta 2 revisiones de diseño sin coste adicional. Las revisiones 
              adicionales pueden tener un cargo extra según la complejidad de los cambios solicitados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">5. Plazos de entrega</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los plazos de entrega varían según el tipo de producto:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Diseños digitales: 3-5 días laborables</li>
              <li>Invitaciones impresas: 7-10 días laborables</li>
              <li>Productos con grabado láser: 5-7 días laborables</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Los plazos comienzan a contar desde la aprobación del diseño y confirmación de pago.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">6. Cancelaciones</h2>
            <p className="text-muted-foreground leading-relaxed">
              Las cancelaciones son posibles antes de la aprobación del diseño final. Una vez aprobado 
              el diseño y realizado el pago, no se admiten cancelaciones ya que el producto es 
              personalizado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">7. Propiedad del diseño</h2>
            <p className="text-muted-foreground leading-relaxed">
              El cliente recibe los derechos de uso del diseño para el propósito acordado. DESIGNOVA 
              se reserva el derecho de mostrar los trabajos realizados en su portafolio, salvo acuerdo 
              expreso de confidencialidad.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
