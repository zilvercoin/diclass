"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { GraduationCap, Bell, Settings, LogOut, User, Check, Bot, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import type { User as UserType } from "@/lib/auth"
import {
  getUserNotifications,
  getUnreadNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
} from "@/lib/notifications"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "@/components/theme-provider"

export function DashboardHeader() {
  const router = useRouter()
  const { resetTheme } = useTheme()
  const [user, setUser] = useState<UserType | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Cargar notificaciones
    loadNotifications(currentUser.id)

    // Configurar intervalo para actualizar notificaciones
    const interval = setInterval(() => {
      loadNotifications(currentUser.id)
    }, 30000) // Actualizar cada 30 segundos

    return () => clearInterval(interval)
  }, [router])

  const loadNotifications = (userId: string) => {
    const userNotifications = getUserNotifications(userId)
    setNotifications(userNotifications)

    const unread = getUnreadNotifications(userId)
    setUnreadCount(unread.length)
  }

  const handleNotificationClick = (notification: Notification) => {
    // Marcar como leída
    markNotificationAsRead(notification.id)

    // Actualizar estado local
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0))

    // Navegar al enlace si existe
    if (notification.link) {
      router.push(notification.link)
    }

    // Cerrar menú de notificaciones
    setNotificationsOpen(false)
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(user?.id || "")

    // Actualizar estado local
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const handleLogout = () => {
    // Resetear el tema al cerrar sesión
    resetTheme()

    // Cerrar sesión
    logout()

    // Mostrar mensaje de éxito
    alert("Has cerrado sesión correctamente")

    // Redirigir al inicio
    router.push("/login")
  }

  if (!user) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/dashboard" className="flex items-center gap-2 mr-4">
          <GraduationCap className="h-6 w-6 text-rose-600" />
          <span className="font-black text-xl tracking-tighter">DiClass</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {user.role === "teacher" && (
              <Link href="/ai-assistant">
                <Button variant="ghost" className="mr-2">
                  <Bot className="mr-2 h-4 w-4" />
                  <span>Asistente IA</span>
                  <span className="ml-2 bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-full dark:bg-rose-900/20">
                    <Sparkles size={10} className="inline mr-1" /> Pro
                  </span>
                </Button>
              </Link>
            )}
            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
                  )}
                  <span className="sr-only">Notificaciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                  <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs h-8">
                      <Check className="h-3 w-3 mr-1" /> Marcar todas como leídas
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`p-3 cursor-pointer notification-item ${!notification.read ? "unread" : ""}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{notification.title}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleDateString("es-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <span className="text-xs mt-1">{notification.message}</span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">No tienes notificaciones</div>
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="flex w-full items-center">
                    <User className="mr-2 h-4 w-4" /> Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="flex w-full items-center">
                    <Settings className="mr-2 h-4 w-4" /> Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)}>
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>

      {/* Diálogo de confirmación para cerrar sesión */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cerrar sesión</DialogTitle>
            <DialogDescription>¿Estás seguro de que quieres cerrar sesión?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
