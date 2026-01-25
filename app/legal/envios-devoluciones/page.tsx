export default function EnviosDevolucionesPage() {
  return (
    <div className="bg-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#1a1a1a]">Envíos y Devoluciones</h1>
        
        <div className="bg-white rounded-2xl p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">Política de envíos</h2>
            
            <div className="space-y-4">
              <div className="bg-gold/10 p-4 rounded-lg border border-gold/20">
                <h3 className="font-semibold text-[#1a1a1a] mb-2">Envío nacional (España)</h3>
                <p className="text-muted-foreground text-sm">
                  Envío estándar: 4-6 días laborables - 4,95€<br />
                  Envío express: 24-48 horas - 9,95€<br />
                  <strong>Envío gratuito</strong> en pedidos superiores a 50€
                </p>
              </div>
              
              <div className="bg-cream-dark p-4 rounded-lg">
                <h3 className="font-semibold text-[#1a1a1a] mb-2">Envío internacional (Europa)</h3>
                <p className="text-muted-foreground text-sm">
                  Plazo: 7-14 días laborables<br />
                  Coste: Desde 12,95€ (varía según destino)
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">Productos digitales</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los diseños digitales (invitaciones para enviar por WhatsApp, posts para redes sociales, etc.) 
              se entregan por correo electrónico en formato PDF y/o JPG de alta resolución, sin coste de envío.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">Seguimiento del pedido</h2>
            <p className="text-muted-foreground leading-relaxed">
              Una vez enviado su pedido, recibirá un email con el número de seguimiento para que pueda 
              rastrear el estado de su envío en todo momento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">Política de devoluciones</h2>
            <p className="text-muted-foreground leading-relaxed">
              Debido a la naturaleza personalizada de nuestros productos, <strong>no aceptamos devoluciones</strong> 
              una vez que el diseño ha sido aprobado por el cliente y el producto ha sido fabricado.
            </p>
            
            <div className="bg-gold/10 p-4 rounded-lg border border-gold/20 mt-4">
              <h3 className="font-semibold text-[#1a1a1a] mb-2">Excepciones</h3>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                <li>Producto dañado durante el transporte</li>
                <li>Error de fabricación por parte de DESIGNOVA</li>
                <li>Producto recibido diferente al aprobado</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">Proceso de reclamación</h2>
            <p className="text-muted-foreground leading-relaxed">
              Si recibe un producto defectuoso o dañado:
            </p>
            <ol className="list-decimal list-inside text-muted-foreground mt-2 space-y-1">
              <li>Contacte con nosotros en las primeras 48 horas tras la recepción</li>
              <li>Envíe fotografías del producto y el embalaje</li>
              <li>Evaluaremos el caso y le ofreceremos una solución</li>
            </ol>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Contacto: designova.studio01@gmail.com | WhatsApp: +34 648 840 097
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
