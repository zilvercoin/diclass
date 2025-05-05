"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useRouter } from "next/navigation"
import { getCurrentUser, updateUserData, getUserActivities } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/image-upload"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState("")
  const [saving, setSaving] = useState(false)
  const [activities, setActivities] = useState<any[]>([])

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
    setAvatar(currentUser.avatar || "")

    // Cargar actividades recientes
    const userActivities = getUserActivities(currentUser.id)
    setActivities(userActivities)
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

    // Actualizar datos del usuario
    updateUserData({
      name,
      email,
      bio,
      avatar,
    })

    // Actualizar estado local
    setUser({
      ...user,
      name,
      email,
      bio,
      avatar,
    })

    // Mostrar notificación
    toast({
      title: "Perfil actualizado",
      description: "Tu perfil ha sido actualizado exitosamente",
    })

    setSaving(false)
  }

  const handleImageChange = (imageDataUrl: string) => {
    setAvatar(imageDataUrl)
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
                  <ImageUpload currentImage={avatar} onImageChange={handleImageChange} size="lg" className="mb-4" />
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="text-sm mt-2 text-gray-600">{user.role === "teacher" ? "Profesor" : "Estudiante"}</p>
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
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`}></div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No hay actividad reciente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </div>
  )
}

// Función para determinar el color según el tipo de actividad
function getActivityColor(type: string): string {
  switch (type) {
    case "comment":
      return "bg-blue-500"
    case "submission":
      return "bg-green-500"
    case "enrollment":
      return "bg-purple-500"
    case "creation":
      return "bg-yellow-500"
    case "grade":
      return "bg-rose-500"
    default:
      return "bg-gray-500"
  }
}
