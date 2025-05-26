import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-rose-600" />
            <h1 className="text-3xl font-black tracking-tighter">DiClass</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-rose-600 hover:bg-rose-700">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-16 bg-gradient-to-b from-rose-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-rose-600">Términos y Condiciones</h1>
              <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed">
                Por favor, lee detenidamente estos términos antes de usar DiClass.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="prose prose-rose max-w-3xl mx-auto">
              <h2>1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar DiClass, aceptas estar legalmente obligado por estos Términos y Condiciones. Si no
                estás de acuerdo con alguno de estos términos, no debes utilizar nuestro servicio.
              </p>

              <h2>2. Cambios en los Términos</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre
                cambios significativos publicando los nuevos términos en nuestra plataforma. El uso continuado de
                DiClass después de dichos cambios constituye tu aceptación de los mismos.
              </p>

              <h2>3. Cuentas de Usuario</h2>
              <p>
                Para utilizar ciertas funciones de DiClass, debes crear una cuenta. Eres responsable de mantener la
                confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta. Debes
                notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.
              </p>

              <h2>4. Uso Aceptable</h2>
              <p>Te comprometes a no utilizar DiClass para:</p>
              <ul>
                <li>Violar leyes o regulaciones aplicables</li>
                <li>Infringir derechos de propiedad intelectual</li>
                <li>Acosar, intimidar o discriminar a otros usuarios</li>
                <li>Distribuir contenido obsceno, ofensivo o inapropiado</li>
                <li>Interferir con el funcionamiento normal de la plataforma</li>
              </ul>

              <h2>5. Contenido del Usuario</h2>
              <p>
                Al subir contenido a DiClass, mantienes tus derechos de propiedad intelectual, pero nos otorgas una
                licencia para usar, modificar, ejecutar, mostrar y distribuir dicho contenido en relación con nuestros
                servicios.
              </p>

              <h2>6. Privacidad</h2>
              <p>
                Tu privacidad es importante para nosotros. Consulta nuestra{" "}
                <Link href="/privacy" className="text-rose-600 hover:underline">
                  Política de Privacidad
                </Link>{" "}
                para entender cómo recopilamos, usamos y protegemos tu información personal.
              </p>

              <h2>7. Terminación</h2>
              <p>
                Podemos suspender o terminar tu acceso a DiClass en cualquier momento, por cualquier motivo, sin previo
                aviso.
              </p>

              <h2>8. Limitación de Responsabilidad</h2>
              <p>
                DiClass se proporciona "tal cual" y "según disponibilidad". No garantizamos que el servicio será
                ininterrumpido, oportuno, seguro o libre de errores. No seremos responsables por daños indirectos,
                incidentales, especiales, consecuentes o punitivos.
              </p>

              <h2>9. Ley Aplicable</h2>
              <p>
                Estos términos se regirán e interpretarán de acuerdo con las leyes de Ecuador, sin tener en cuenta sus
                disposiciones sobre conflictos de leyes.
              </p>

              <h2>10. Contacto</h2>
              <p>
                Si tienes preguntas sobre estos Términos, contáctanos en{" "}
                <a href="mailto:danielaguilardel@gmail.com" className="text-rose-600 hover:underline">
                  danielaguilardel@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 text-center md:flex-row md:gap-8 md:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-rose-600" />
            <p className="text-xl font-black tracking-tighter">DiClass</p>
          </div>
          <p className="text-sm text-gray-500 md:ml-auto">© 2024 DiClass. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:underline">
              Términos
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:underline">
              Privacidad
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:underline">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
