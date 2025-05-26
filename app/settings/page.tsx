"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "@/components/theme-provider"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [language, setLanguage] = useState("es")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Cargar configuraciones guardadas en localStorage si existen
    const savedSettings = localStorage.getItem("diclass_settings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setEmailNotifications(settings.emailNotifications)
      setPushNotifications(settings.pushNotifications)
      setLanguage(settings.language)
    }
  }, [router])

  const handleSaveSettings = () => {
    setSaving(true)

    // Simular retraso de red
    setTimeout(() => {
      // Guardar configuraciones en localStorage
      localStorage.setItem(
        "diclass_settings",
        JSON.stringify({
          emailNotifications,
          pushNotifications,
          language,
        }),
      )

      // Mostrar notificación
      toast({
        title: "Configuración guardada",
        description: "Tus preferencias han sido actualizadas exitosamente",
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
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">
                      Notificaciones por correo
                    </Label>
                    <p className="text-sm text-gray-500">
                      Recibe actualizaciones sobre tus clases y tareas por correo electrónico
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="font-medium">
                      Notificaciones push
                    </Label>
                    <p className="text-sm text-gray-500">Recibe notificaciones en tiempo real en tu navegador</p>
                  </div>
                  <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Apariencia</CardTitle>
              <CardDescription>Personaliza la apariencia de DiClass</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium mb-2 block">Tema</Label>
                  <RadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Claro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark">Oscuro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system">Sistema</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Idioma y Región</CardTitle>
              <CardDescription>Configura tus preferencias de idioma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium mb-2 block">Idioma</Label>
                  <RadioGroup value={language} onValueChange={setLanguage} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="es" id="es" />
                      <Label htmlFor="es">Español</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="en" id="en" />
                      <Label htmlFor="en">Inglés</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacidad</CardTitle>
              <CardDescription>Configura tus preferencias de privacidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visibility" className="font-medium">
                      Visibilidad del perfil
                    </Label>
                    <p className="text-sm text-gray-500">Permite que otros usuarios vean tu perfil</p>
                  </div>
                  <Switch id="profile-visibility" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="activity-status" className="font-medium">
                      Estado de actividad
                    </Label>
                    <p className="text-sm text-gray-500">Muestra cuando estás en línea</p>
                  </div>
                  <Switch id="activity-status" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleSaveSettings} disabled={saving}>
              {saving ? "Guardando..." : "Guardar configuración"}
            </Button>
          </div>
        </div>
      </DashboardShell>
    </div>
  )
}
