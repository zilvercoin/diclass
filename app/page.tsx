import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, MessageSquare, Star, CheckCircle } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-lg font-black tracking-tighter">DiClass</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            Acerca de
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/contact">
            Contacto
          </Link>
          <ThemeSwitcher />
          <Link href="/login">
            <Button variant="outline" size="sm">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Registrarse
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center max-w-3xl mx-auto">
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Aprende. Colabora. Crece.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  DiClass es la plataforma educativa que conecta estudiantes y profesores en un entorno de aprendizaje
                  moderno y colaborativo.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700" size="lg">
                    Comenzar Ahora
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Saber Más
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter sm:text-5xl">Características Principales</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Descubre las herramientas que hacen de DiClass la mejor opción para tu educación.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-blue-600" />
                  <CardTitle>Clases Virtuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Crea y únete a clases virtuales con facilidad. Gestiona estudiantes, tareas y calificaciones en un
                    solo lugar.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-blue-600" />
                  <CardTitle>Gestión de Tareas</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Asigna, entrega y califica tareas de manera eficiente. Seguimiento en tiempo real del progreso de
                    los estudiantes.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MessageSquare className="h-10 w-10 text-blue-600" />
                  <CardTitle>Comunicación Fluida</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Mantén una comunicación constante con anuncios, comentarios y notificaciones en tiempo real.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tighter sm:text-5xl">¿Por qué elegir DiClass?</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Nuestra plataforma está diseñada pensando en las necesidades reales de estudiantes y profesores.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Interfaz intuitiva y fácil de usar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Acceso desde cualquier dispositivo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Notificaciones en tiempo real</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Seguridad y privacidad garantizada</span>
                  </li>
                </ul>
              </div>
              <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last bg-black">
                <Image
                  src="/images/informatica-febres-logo.png"
                  alt="Informática Febres Logo"
                  width={600}
                  height={600}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter sm:text-5xl">Lo que dicen nuestros usuarios</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Testimonios reales de estudiantes y profesores que ya usan DiClass.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-blue-600 text-blue-600" />
                      ))}
                    </div>
                  </div>
                  <CardTitle>María González</CardTitle>
                  <CardDescription>Estudiante de Bachillerato</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    "DiClass ha transformado mi experiencia educativa. Ahora puedo seguir mis tareas y comunicarme con
                    mis profesores de manera muy sencilla."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-blue-600 text-blue-600" />
                      ))}
                    </div>
                  </div>
                  <CardTitle>Prof. Carlos Ruiz</CardTitle>
                  <CardDescription>Profesor de Matemáticas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    "Como profesor, DiClass me permite gestionar mis clases de manera eficiente y mantener una
                    comunicación fluida con mis estudiantes."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-blue-600 text-blue-600" />
                      ))}
                    </div>
                  </div>
                  <CardTitle>Ana Martínez</CardTitle>
                  <CardDescription>Estudiante Universitaria</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    "La plataforma es muy intuitiva y me ayuda a mantenerme organizada con todas mis materias y tareas
                    pendientes."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter sm:text-5xl">
                  ¿Listo para comenzar tu viaje educativo?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Únete a miles de estudiantes y profesores que ya están transformando su experiencia educativa con
                  DiClass.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700" size="lg">
                    Crear Cuenta Gratis
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contactar Ventas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 DiClass. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Términos de Servicio
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  )
}
