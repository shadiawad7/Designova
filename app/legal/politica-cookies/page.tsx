export default function PoliticaCookiesPage() {
  return (
    <div className="bg-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#1a1a1a]">Política de Cookies</h1>
        
        <div className="bg-white rounded-2xl p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">¿Qué son las cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita 
              nuestro sitio web. Nos permiten recordar sus preferencias y mejorar su experiencia de navegación.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">Tipos de cookies que utilizamos</h2>
            
            <div className="space-y-4">
              <div className="bg-cream-dark p-4 rounded-lg">
                <h3 className="font-semibold text-[#1a1a1a] mb-2">Cookies técnicas (necesarias)</h3>
                <p className="text-muted-foreground text-sm">
                  Son imprescindibles para el funcionamiento del sitio web. Permiten navegar y utilizar 
                  funciones básicas como el carrito de compras.
                </p>
              </div>
              
              <div className="bg-cream-dark p-4 rounded-lg">
                <h3 className="font-semibold text-[#1a1a1a] mb-2">Cookies de preferencias</h3>
                <p className="text-muted-foreground text-sm">
                  Permiten recordar información para que no tenga que configurar el sitio web cada vez que lo visite.
                </p>
              </div>
              
              <div className="bg-cream-dark p-4 rounded-lg">
                <h3 className="font-semibold text-[#1a1a1a] mb-2">Cookies analíticas</h3>
                <p className="text-muted-foreground text-sm">
                  Nos ayudan a entender cómo los visitantes interactúan con el sitio web, recopilando 
                  información de forma anónima.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">Gestión de cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Puede configurar su navegador para bloquear o alertar sobre estas cookies. Sin embargo, 
              algunas partes del sitio pueden no funcionar correctamente si desactiva las cookies necesarias.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Para más información sobre cómo gestionar cookies en su navegador:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Chrome: Configuración &gt; Privacidad y seguridad &gt; Cookies</li>
              <li>Firefox: Opciones &gt; Privacidad &gt; Historial</li>
              <li>Safari: Preferencias &gt; Privacidad</li>
              <li>Edge: Configuración &gt; Privacidad &gt; Cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#1a1a1a]">Actualizaciones</h2>
            <p className="text-muted-foreground leading-relaxed">
              Esta política de cookies puede actualizarse, por lo que le recomendamos revisarla periódicamente.
              Última actualización: Enero 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
