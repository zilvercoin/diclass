"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GraduationCap } from "lucide-react"
import { registerUser, getUserByEmail } from "@/lib/auth"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userType, setUserType] = useState("student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validación básica
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      // Verificar si el correo ya está registrado
      const existingUser = getUserByEmail(email)
      if (existingUser) {
        setError("Este correo electrónico ya está registrado")
        setLoading(false)
        return
      }

      // Registrar nuevo usuario
      const newUser = registerUser({
        name,
        email,
        password,
        role: userType as "student" | "teacher",
        avatar: `/placeholder.svg?height=40&width=40`,
      })

      if (!newUser) {
        setError("Error al crear la cuenta. Inténtalo de nuevo.")
        setLoading(false)
        return
      }

      // Guardar información de sesión
      localStorage.setItem("diclass_user", JSON.stringify(newUser))

      // Mostrar mensaje de éxito
      alert("Registro exitoso. Tu cuenta ha sido creada correctamente")

      // Redireccionar al dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } catch (err) {
      setError("Error al crear la cuenta. Inténtalo de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-rose-600" />
          <h1 className="text-3xl font-black tracking-tighter">DiClass</h1>
        </Link>
        <ThemeSwitcher />
      </div>
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/">
              <GraduationCap className="h-12 w-12 text-rose-600" />
            </Link>
            <h1 className="text-4xl font-black tracking-tighter text-rose-600">DiClass</h1>
            <p className="text-gray-600 dark:text-gray-400">Crea tu cuenta para comenzar</p>
          </div>
          <div className="mt-8">
            <div className="bg-white dark:bg-card p-6 shadow-lg rounded-lg">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de usuario</Label>
                  <RadioGroup value={userType} onValueChange={setUserType} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">Estudiante</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="teacher" id="teacher" />
                      <Label htmlFor="teacher">Profesor</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Registrarse"}
                </Button>
              </form>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-rose-600 hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
