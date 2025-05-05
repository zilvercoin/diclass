import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"

export default function AboutPage() {
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
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-rose-600">Sobre DiClass</h1>
              <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed">
                Conoce más sobre nuestra plataforma educativa y cómo estamos transformando la educación digital.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">Nuestra Misión</h2>
                <p className="text-gray-600 md:text-lg/relaxed mb-4">
                  En DiClass, nuestra misión es proporcionar una plataforma educativa intuitiva y eficiente que conecte
                  a profesores y estudiantes, facilitando el proceso de enseñanza y aprendizaje en el mundo digital.
                </p>
                <p className="text-gray-600 md:text-lg/relaxed">
                  Creemos que la tecnología debe simplificar la educación, no complicarla. Por eso, hemos diseñado
                  DiClass para ser accesible, fácil de usar y adaptable a diferentes estilos de enseñanza y aprendizaje.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">Nuestra Historia</h2>
                <p className="text-gray-600 md:text-lg/relaxed mb-4">
                  DiClass nació de la necesidad de crear una plataforma educativa que realmente entienda las necesidades
                  de profesores y estudiantes. Fundada en 2023, nuestra plataforma ha crecido rápidamente, sirviendo a
                  instituciones educativas de todos los tamaños.
                </p>
                <p className="text-gray-600 md:text-lg/relaxed">
                  Nuestro equipo está formado por educadores, desarrolladores y diseñadores apasionados por la educación
                  y la tecnología, trabajando juntos para crear la mejor experiencia posible.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">¿Por qué elegir DiClass?</h2>
              <p className="max-w-[700px] text-gray-600 md:text-lg/relaxed">
                Nuestra plataforma ofrece ventajas únicas para mejorar la experiencia educativa.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">Fácil de usar</h3>
                <p className="text-gray-600">
                  Interfaz intuitiva diseñada para profesores y estudiantes de todas las edades y niveles de habilidad
                  tecnológica.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">Colaboración en tiempo real</h3>
                <p className="text-gray-600">
                  Herramientas que facilitan la comunicación y colaboración entre estudiantes y profesores.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">Organización eficiente</h3>
                <p className="text-gray-600">
                  Mantén todas tus clases, tareas y calificaciones organizadas en un solo lugar.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Nuestro Equipo</h2>
              <p className="max-w-[700px] text-gray-600 md:text-lg/relaxed">Conoce a las personas detrás de DiClass.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
                <h3 className="text-xl font-bold">Daniel Aguilar</h3>
                <p className="text-gray-600">Fundador y CEO</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
                <h3 className="text-xl font-bold">María Rodríguez</h3>
                <p className="text-gray-600">Directora de Educación</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
                <h3 className="text-xl font-bold">Carlos Sánchez</h3>
                <p className="text-gray-600">Jefe de Desarrollo</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-rose-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">¿Listo para empezar?</h2>
              <p className="max-w-[700px] text-gray-600 md:text-lg/relaxed mb-6">
                Únete a miles de profesores y estudiantes que ya están usando DiClass.
              </p>
              <Link href="/register">
                <Button className="bg-rose-600 hover:bg-rose-700 px-8 py-6 text-lg">Registrarse Ahora</Button>
              </Link>
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
