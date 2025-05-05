import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-rose-600" />
            <h1 className="text-3xl font-black tracking-tighter">DiClass</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
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
        <section className="py-20 md:py-32 bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/20 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-rose-600 leading-tight">
                  Aprende. Colabora. Crece.
                </h2>
                <p className="text-xl text-gray-600 md:text-2xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  DiClass simplifica la enseñanza y el aprendizaje, ayudando a los educadores a gestionar sus clases y a
                  los estudiantes a mantenerse organizados.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button className="bg-rose-600 hover:bg-rose-700 px-8 py-6 text-lg">Comenzar Ahora</Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" className="px-8 py-6 text-lg">
                      Saber Más
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto flex justify-center">
                <img
                  alt="DiClass Dashboard"
                  className="rounded-lg object-cover shadow-xl"
                  src="/images/education-book.png"
                  width={550}
                  height={550}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 bg-white dark:bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter sm:text-5xl text-rose-600">
                  Características Principales
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Todo lo que necesitas para gestionar tus clases en un solo lugar
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/20">
                  <GraduationCap className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold">Gestión de Clases</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Crea, organiza y gestiona todas tus clases desde un solo panel de control.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-rose-600"
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    <path d="m9 14 2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Tareas y Evaluaciones</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Crea, asigna y califica tareas fácilmente con nuestro sistema intuitivo.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-rose-600"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Colaboración</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Facilita la comunicación entre estudiantes y profesores con herramientas colaborativas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 text-center md:flex-row md:gap-8 md:text-left">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-rose-600" />
            <p className="text-xl font-black tracking-tighter">DiClass</p>
          </Link>
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
