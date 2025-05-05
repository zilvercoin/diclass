"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useRouter } from "next/navigation"
import { getCurrentUser, updateUserData } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setName(currentUser.name || "")
    setEmail(currentUser.email || "")
    setBio(currentUser.bio || "")
  }, [router])

  const handleSaveProfile = () => {
    if (!name || !email) {
      toast({
        title: "Error",
        description: "Por favor, completa los campos obligatorios",
      })
      return
    }

    setSaving(true)

    // Simular retraso de red
    setTimeout(() => {
      // Actualizar datos del usuario
      updateUserData({
        name,
        email,
        bio,
      })

      // Actualizar estado local
      setUser({
        ...user,
        name,
        email,
        bio,
      })

      // Mostrar notificación
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado exitosamente",
      })

      setSaving(false)
    }, 1000)
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Tu Perfil</CardTitle>
                  <CardDescription>Gestiona tu información personal</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg?height=96&width=96"} alt={user.name} />
                    <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="text-sm mt-2 text-gray-600">{user.role === "teacher" ? "Profesor" : "Estudiante"}</p>
                  <Button variant="outline" className="mt-4">
                    Cambiar foto
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="md:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle>Editar Perfil</CardTitle>
                  <CardDescription>Actualiza tu información personal</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="personal">Información Personal</TabsTrigger>
                      <TabsTrigger value="account">Cuenta</TabsTrigger>
                      <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nombre completo</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@ejemplo.com"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bio">Biografía</Label>
                          <Input
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Cuéntanos sobre ti"
                          />
                        </div>
                        <Button
                          className="bg-rose-600 hover:bg-rose-700 mt-2"
                          onClick={handleSaveProfile}
                          disabled={saving}
                        >
                          {saving ? "Guardando..." : "Guardar cambios"}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="account">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="current-password">Contraseña actual</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="new-password">Nueva contraseña</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button className="bg-rose-600 hover:bg-rose-700 mt-2">Cambiar contraseña</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="notifications">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Notificaciones por correo</h3>
                            <p className="text-sm text-gray-500">Recibe notificaciones por correo electrónico</p>
                          </div>
                          <Button variant="outline">Configurar</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Notificaciones en la plataforma</h3>
                            <p className="text-sm text-gray-500">Configura las notificaciones dentro de DiClass</p>
                          </div>
                          <Button variant="outline">Configurar</Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Tu actividad reciente en DiClass</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Comentaste en "Problemas de Ecuaciones Diferenciales"</p>
                    <p className="text-sm text-gray-500">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Te uniste a la clase "Física Cuántica"</p>
                    <p className="text-sm text-gray-500">Hace 1 día</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Entregaste "Ensayo sobre la Segunda Guerra Mundial"</p>
                    <p className="text-sm text-gray-500">Hace 3 días</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </div>
  )
}
