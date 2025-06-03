"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, UserPlus, Edit, Trash2, LogOut, Shield, TrendingUp, DollarSign, Calendar } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  joinDate: string
  lastPayment: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Elvis Rivas",
      email: "elvis@academia.com",
      role: "Jugador",
      status: "Activo",
      joinDate: "2024-01-15",
      lastPayment: "2024-12-01",
    },
    {
      id: 2,
      name: "Juan Pintado",
      email: "juan@academia.com",
      role: "Jugador",
      status: "Activo",
      joinDate: "2024-02-10",
      lastPayment: "2024-12-01",
    },
    {
      id: 3,
      name: "Kevin Muñoz",
      email: "kevin@academia.com",
      role: "Jugador",
      status: "Activo",
      joinDate: "2024-01-20",
      lastPayment: "2024-11-15",
    },
    {
      id: 4,
      name: "Mateo Ortega",
      email: "mateo@academia.com",
      role: "Portero",
      status: "Activo",
      joinDate: "2024-03-05",
      lastPayment: "2024-12-01",
    },
    {
      id: 5,
      name: "Estiven Toledo",
      email: "estiven@academia.com",
      role: "Jugador",
      status: "Activo",
      joinDate: "2024-02-28",
      lastPayment: "2024-12-01",
    },
    {
      id: 6,
      name: "Mantis",
      email: "mantis@academia.com",
      role: "Jugador",
      status: "Inactivo",
      joinDate: "2024-01-10",
      lastPayment: "2024-10-15",
    },
    {
      id: 7,
      name: "Chino",
      email: "chino@academia.com",
      role: "Jugador",
      status: "Activo",
      joinDate: "2024-03-12",
      lastPayment: "2024-12-01",
    },
  ])

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Jugador" })

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "admin") {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)))
      setEditingUser(null)
    }
  }

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "Activo",
        joinDate: new Date().toISOString().split("T")[0],
        lastPayment: new Date().toISOString().split("T")[0],
      }
      setUsers([...users, user])
      setNewUser({ name: "", email: "", role: "Jugador" })
    }
  }

  const activeUsers = users.filter((user) => user.status === "Activo").length
  const totalRevenue = users.filter((user) => user.status === "Activo").length * 50000 // $50,000 por usuario activo
  const recentPayments = users.filter((user) => new Date(user.lastPayment) > new Date("2024-11-01")).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Panel Administrativo</h1>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pagos Recientes</p>
                  <p className="text-2xl font-bold text-gray-900">{recentPayments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra todos los usuarios de la academia</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Agregar Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                    <DialogDescription>Completa la información del nuevo usuario</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="email@ejemplo.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Rol</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      >
                        <option value="Jugador">Jugador</option>
                        <option value="Portero">Portero</option>
                        <option value="Entrenador">Entrenador</option>
                      </select>
                    </div>
                    <Button onClick={handleAddUser} className="w-full">
                      Agregar Usuario
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Ingreso</TableHead>
                  <TableHead>Último Pago</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Activo" ? "default" : "secondary"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>{user.lastPayment}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Usuario</DialogTitle>
                            </DialogHeader>
                            {editingUser && (
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-name">Nombre</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-email">Email</Label>
                                  <Input
                                    id="edit-email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-status">Estado</Label>
                                  <select
                                    className="w-full p-2 border rounded-md"
                                    value={editingUser.status}
                                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                                  >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                  </select>
                                </div>
                                <Button onClick={handleUpdateUser} className="w-full">
                                  Actualizar Usuario
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
