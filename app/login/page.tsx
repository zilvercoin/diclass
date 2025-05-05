"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { authenticateUser, getUserByEmail } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validación básica
    if (!email || !password) {
      setError("Por favor, completa todos los campos")
      setLoading(false)
      return
    }

    try {
      // Verificar si el usuario existe
      const existingUser = getUserByEmail(email)

      if (!existingUser) {
        setError("No existe una cuenta con este correo electrónico")
        setLoading(false)
        return
      }

      // Autenticar usuario con email y contraseña
      const authenticatedUser = authenticateUser(email, password)

      if (!authenticatedUser) {
        setError("Contraseña incorrecta")
        setLoading(false)
        return
      }

      // Guardar información de sesión
      localStorage.setItem("diclass_user", JSON.stringify(authenticatedUser))

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a DiClass",
      })

      // Redireccionar al dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (err) {
      setError("Error al iniciar sesión. Inténtalo de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/">
              <GraduationCap className="h-12 w-12 text-rose-600" />
            </Link>
            <h1 className="text-4xl font-black tracking-tighter text-rose-600">DiClass</h1>
            <p className="text-gray-600">Inicia sesión para continuar</p>
          </div>
          <div className="mt-8">
            <div className="bg-white p-6 shadow-lg rounded-lg">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link href="/forgot-password" className="text-sm text-rose-600 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
                <div className="text-xs text-gray-500 mt-2">
                  Sugerencia: Regístrate primero para crear una cuenta con contraseña segura
                </div>
              </form>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-rose-600 hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
