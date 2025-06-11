import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"

export default function PrivacyPage() {
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
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-rose-600">Política de Privacidad</h1>
              <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed">
                Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos
                tu información.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="prose prose-rose max-w-3xl mx-auto">
              <h2>1. Información que Recopilamos</h2>
              <p>Podemos recopilar los siguientes tipos de información:</p>
              <ul>
                <li>
                  <strong>Información personal:</strong> Nombre, dirección de correo electrónico, número de teléfono,
                  institución educativa.
                </li>
                <li>
                  <strong>Información de uso:</strong> Cómo interactúas con nuestra plataforma, incluyendo páginas
                  visitadas, tiempo de uso y funciones utilizadas.
                </li>
                <li>
                  <strong>Información del dispositivo:</strong> Tipo de dispositivo, sistema operativo, navegador y
                  dirección IP.
                </li>
                <li>
                  <strong>Contenido del usuario:</strong> Tareas, comentarios, archivos y otros materiales que subas a
                  la plataforma.
                </li>
              </ul>

              <h2>2. Cómo Usamos tu Información</h2>
              <p>Utilizamos la información recopilada para:</p>
              <ul>
                <li>Proporcionar, mantener y mejorar nuestros servicios</li>
                <li>Personalizar tu experiencia en DiClass</li>
                <li>Comunicarnos contigo sobre actualizaciones, nuevas funciones o soporte</li>
                <li>Detectar, prevenir y abordar problemas técnicos o de seguridad</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>

              <h2>3. Compartición de Información</h2>
              <p>
                No vendemos tu información personal a terceros. Podemos compartir información en las siguientes
                circunstancias:
              </p>
              <ul>
                <li>Con otros usuarios de tu clase o institución, según la configuración de privacidad que elijas</li>
                <li>Con proveedores de servicios que nos ayudan a operar DiClass</li>
                <li>Para cumplir con la ley o proteger derechos, propiedad o seguridad</li>
                <li>
                  En caso de fusión, venta o transferencia de activos, con el consentimiento del usuario cuando sea
                  requerido
                </li>
              </ul>

              <h2>4. Seguridad de Datos</h2>
              <p>
                Implementamos medidas de seguridad diseñadas para proteger tu información personal, incluyendo
                encriptación, acceso restringido a datos y monitoreo regular de seguridad. Sin embargo, ningún sistema
                es completamente seguro, y no podemos garantizar la seguridad absoluta de tu información.
              </p>

              <h2>5. Tus Derechos</h2>
              <p>
                Dependiendo de tu ubicación, puedes tener derechos relacionados con tus datos personales, incluyendo:
              </p>
              <ul>
                <li>Acceder a tu información personal</li>
                <li>Corregir información inexacta</li>
                <li>Eliminar tu información en ciertas circunstancias</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Portar tus datos a otro servicio</li>
              </ul>

              <h2>6. Información de Menores</h2>
              <p>
                DiClass puede ser utilizado por estudiantes menores de 18 años. Recopilamos información de menores solo
                con el consentimiento verificable de los padres o tutores legales, o a través de la institución
                educativa del menor, de acuerdo con las leyes aplicables.
              </p>

              <h2>7. Cambios a esta Política</h2>
              <p>
                Podemos actualizar nuestra Política de Privacidad periódicamente. Te notificaremos sobre cambios
                significativos publicando la nueva política en nuestra plataforma y, cuando sea apropiado, mediante
                notificación por correo electrónico.
              </p>

              <h2>8. Contacto</h2>
              <p>
                Si tienes preguntas sobre esta Política de Privacidad, contáctanos en{" "}
                <a href="mailto:danielaguilardel@gmail.com" className="text-rose-600 hover:underline">
                  danielaguilardel@gmail.com
                </a>{" "}
                o al teléfono 0999719613.
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
