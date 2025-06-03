"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Trophy,
  Users,
  Target,
  Star,
  Shield,
  Zap,
  Globe,
  Award,
  Play,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Facebook,
  Mail,
  CheckCircle,
} from "lucide-react"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [activeUsers, setActiveUsers] = useState(1247)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const testimonials = [
    {
      name: "Carlos Rodríguez",
      role: "Ex-jugador profesional",
      text: "Esta academia transformó mi carrera. Los entrenamientos son de clase mundial.",
      rating: 5,
    },
    {
      name: "María González",
      role: "Madre de jugador",
      text: "Mi hijo ha crecido tanto técnica como personalmente. Excelente ambiente.",
      rating: 5,
    },
    {
      name: "Luis Pérez",
      role: "Entrenador",
      text: "Las instalaciones y metodología son excepcionales. Recomiendo 100%.",
      rating: 5,
    },
  ]

  const achievements = [
    { icon: "🏆", title: "15 Títulos", subtitle: "Ganados en 2024" },
    { icon: "⭐", title: "98%", subtitle: "Satisfacción" },
    { icon: "🎯", title: "500+", subtitle: "Jugadores formados" },
    { icon: "🏅", title: "25", subtitle: "Profesionales" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === "admin@academia.com" && password === "admin123") {
      localStorage.setItem("userType", "admin")
      localStorage.setItem("userEmail", email)
      router.push("/admin")
    } else if (email && password) {
      localStorage.setItem("userType", "user")
      localStorage.setItem("userEmail", email)
      router.push("/dashboard")
    } else {
      alert("Credenciales inválidas")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && password) {
      // Simular registro exitoso
      setRegistrationSuccess(true)
      setName("")
      setEmail("")
      setPassword("")

      // Cambiar automáticamente a la pestaña de login
      setActiveTab("login")

      // Mostrar mensaje de éxito
      alert("¡Cuenta creada exitosamente! Por favor inicia sesión con tus credenciales.")
    } else {
      alert("Por favor completa todos los campos")
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-green-400 via-blue-500 to-purple-600"} relative overflow-hidden`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Football Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <div className="text-white/20 text-2xl">⚽</div>
          </div>
        ))}

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-green-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header with Dark Mode Toggle */}
      <header className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <span className="text-white font-bold text-xl">Academia Elite</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-white" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <Moon className="h-4 w-4 text-white" />
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-white space-y-8">
            {/* Main Hero */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2 animate-pulse">
                  <Trophy className="w-5 h-5 mr-2" />
                  #1 Academia de Colombia
                </Badge>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Forma tu
                </span>
                <br />
                <span className="text-white">Futuro</span>
                <br />
                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  Deportivo
                </span>
              </h1>

              <p className="text-xl text-white/90 max-w-lg leading-relaxed">
                Únete a la academia de fútbol más prestigiosa de Colombia. Desarrolla tus habilidades con metodología
                europea y entrenadores de élite.
              </p>

              {/* Live Stats */}
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">En vivo:</span>
                </div>
                <span className="font-bold">{activeUsers.toLocaleString()} usuarios activos</span>
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-2xl font-bold">{achievement.title}</div>
                  <div className="text-sm text-white/80">{achievement.subtitle}</div>
                </div>
              ))}
            </div>

            {/* Testimonials Carousel */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold">Lo que dicen nuestros jugadores</span>
                </div>
                <div className="space-y-4">
                  <p className="text-white/90 italic">"{testimonials[currentTestimonial].text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                      <p className="text-sm text-white/70">{testimonials[currentTestimonial].role}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video Preview */}
            <div className="relative group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">🎥 Tour Virtual de la Academia</h3>
                    <p className="text-white/80 text-sm">Conoce nuestras instalaciones de clase mundial</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Auth Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Bienvenido
                </CardTitle>
                <CardDescription className="text-lg">Accede a tu cuenta o únete a nuestra familia</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                    >
                      Iniciar Sesión
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                    >
                      Registrarse
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    {registrationSuccess && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-800 font-semibold">¡Registro exitoso!</span>
                        </div>
                        <p className="text-green-700 text-sm mt-1">
                          Tu cuenta ha sido creada. Ahora puedes iniciar sesión con tus credenciales.
                        </p>
                      </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Correo Electrónico
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Contraseña
                        </Label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 border-2 focus:border-blue-500 transition-colors"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>Recordarme</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:underline">
                          ¿Olvidaste tu contraseña?
                        </a>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Iniciar Sesión
                      </Button>
                    </form>

                    {/* Social Login */}
                    <div className="space-y-3">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">O continúa con</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-12 border-2 hover:bg-blue-50">
                          <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                          Facebook
                        </Button>
                        <Button variant="outline" className="h-12 border-2 hover:bg-red-50">
                          <Globe className="w-5 h-5 mr-2 text-red-600" />
                          Google
                        </Button>
                      </div>
                    </div>

                    {/* Demo Credentials */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-sm mb-2 text-gray-700">🚀 Credenciales Demo:</h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>
                          <strong>Admin:</strong> admin@academia.com / admin123
                        </p>
                        <p>
                          <strong>Usuario:</strong> cualquier email / contraseña
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nombre Completo
                        </Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Tu nombre completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-register" className="text-sm font-medium">
                          Correo Electrónico
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email-register"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password-register" className="text-sm font-medium">
                          Contraseña
                        </Label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password-register"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 border-2 focus:border-blue-500 transition-colors"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-start gap-2 text-sm">
                          <input type="checkbox" className="rounded mt-1" required />
                          <span className="text-gray-600">
                            Acepto los{" "}
                            <a href="#" className="text-blue-600 hover:underline">
                              términos y condiciones
                            </a>{" "}
                            y la{" "}
                            <a href="#" className="text-blue-600 hover:underline">
                              política de privacidad
                            </a>
                          </span>
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          <span className="text-gray-600">Quiero recibir noticias y ofertas especiales</span>
                        </label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Award className="w-5 h-5 mr-2" />
                        Crear Cuenta
                      </Button>
                    </form>

                    {/* Benefits */}
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-sm mb-2 text-gray-700">✨ Al registrarte obtienes:</h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li>• Acceso completo a la plataforma</li>
                        <li>• Seguimiento personalizado de progreso</li>
                        <li>• Comunicación directa con entrenadores</li>
                        <li>• Descuentos en equipamiento</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-4 border-t">
                  <Shield className="h-4 w-4" />
                  <span>Protegido con encriptación SSL de 256 bits</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
              <Target className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold">Entrenamiento Personalizado</h3>
            <p className="text-white/80">Planes adaptados a tu nivel y objetivos específicos</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold">Comunidad Elite</h3>
            <p className="text-white/80">Conecta con jugadores y entrenadores de alto nivel</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold">Resultados Comprobados</h3>
            <p className="text-white/80">Más de 25 jugadores profesionales formados</p>
          </div>
        </div>
      </div>
    </div>
  )
}
