import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
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
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-rose-600">Contacto</h1>
              <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed">
                Estamos aquí para ayudarte. Ponte en contacto con nosotros para cualquier consulta o soporte.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-6">Información de Contacto</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-rose-600 mt-0.5" />
                    <div>
                      <h3 className="font-bold">Correo Electrónico</h3>
                      <p className="text-gray-600">danielaguilardel@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-rose-600 mt-0.5" />
                    <div>
                      <h3 className="font-bold">Teléfono</h3>
                      <p className="text-gray-600">0999719613</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-rose-600 mt-0.5" />
                    <div>
                      <h3 className="font-bold">Dirección</h3>
                      <p className="text-gray-600">
                        Av. Principal 123
                        <br />
                        Quito, Ecuador
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Horario de Atención</h3>
                  <p className="text-gray-600 mb-2">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Sábados: 9:00 AM - 1:00 PM</p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-6">Envíanos un Mensaje</h2>

                <form className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="font-medium">
                        Nombre
                      </label>
                      <Input id="name" placeholder="Tu nombre" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="font-medium">
                        Correo Electrónico
                      </label>
                      <Input id="email" type="email" placeholder="tu@ejemplo.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="font-medium">
                      Asunto
                    </label>
                    <Input id="subject" placeholder="Asunto de tu mensaje" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="font-medium">
                      Mensaje
                    </label>
                    <Textarea id="message" placeholder="Escribe tu mensaje aquí..." className="min-h-[150px]" />
                  </div>

                  <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                    Enviar Mensaje
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Preguntas Frecuentes</h2>
              <p className="max-w-[700px] text-gray-600 md:text-lg/relaxed">
                Respuestas a las preguntas más comunes sobre DiClass.
              </p>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">¿Cómo puedo crear una clase?</h3>
                <p className="text-gray-600">
                  Para crear una clase, inicia sesión en tu cuenta, ve al Dashboard y haz clic en el botón "Crear
                  Clase". Completa la información requerida y tu clase estará lista.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">¿Cómo puedo unirme a una clase como estudiante?</h3>
                <p className="text-gray-600">
                  Para unirte a una clase, necesitas el código de la clase que te proporcionará tu profesor. Ve a tu
                  Dashboard, haz clic en "Unirse a una clase" e ingresa el código.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">¿DiClass es gratuito?</h3>
                <p className="text-gray-600">
                  Sí, DiClass ofrece una versión gratuita con todas las funcionalidades básicas. También tenemos planes
                  premium con características adicionales para instituciones educativas.
                </p>
              </div>
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
