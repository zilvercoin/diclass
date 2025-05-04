"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Calendar, Clock, FileText, MessageSquare, Plus, Users } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function ClassPage({ params }: { params: { id: string } }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")

  const handleCreateAssignment = () => {
    // Simulación de creación de tarea
    setOpen(false)
    // Aquí iría la lógica para crear una nueva tarea
  }

  // Datos simulados de la clase
  const classData = {
    id: params.id,
    title: "Matemáticas Avanzadas",
    section: "Periodo 3",
    teacher: "Prof. García",
    description:
      "Curso avanzado de matemáticas que cubre cálculo diferencial e integral, ecuaciones diferenciales y álgebra lineal.",
    students: 24,
    code: "abc123xyz",
    color: "bg-blue-100",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className={`w-full h-32 ${classData.color} rounded-lg mb-4 flex items-end p-6`}>
          <div>
            <h1 className="text-3xl font-bold">{classData.title}</h1>
            <p className="text-gray-700">{classData.section}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4">
            <Tabs defaultValue="stream" className="w-full">
              <TabsList>
                <TabsTrigger value="stream">
                  <MessageSquare className="mr-2 h-4 w-4" /> Novedades
                </TabsTrigger>
                <TabsTrigger value="classwork">
                  <FileText className="mr-2 h-4 w-4" /> Trabajo en clase
                </TabsTrigger>
                <TabsTrigger value="people">
                  <Users className="mr-2 h-4 w-4" /> Personas
                </TabsTrigger>
                <TabsTrigger value="grades">
                  <BookOpen className="mr-2 h-4 w-4" /> Calificaciones
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stream" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@teacher" />
                        <AvatarFallback>PG</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{classData.teacher}</CardTitle>
                        <CardDescription>Publicado hoy</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>
                      ¡Bienvenidos a la clase de Matemáticas Avanzadas! En este curso exploraremos conceptos avanzados
                      de cálculo, álgebra lineal y ecuaciones diferenciales. Por favor, revisen el material de la
                      primera unidad y prepárense para nuestra primera sesión.
                    </p>
                  </CardContent>
                </Card>

                <div className="mt-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@teacher" />
                          <AvatarFallback>PG</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{classData.teacher}</CardTitle>
                          <CardDescription>Publicado ayer</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>
                        He subido los materiales de lectura para la primera unidad. Por favor, revisen los documentos y
                        vengan preparados para la discusión en la próxima clase. Recuerden que tendremos un pequeño
                        cuestionario sobre estos conceptos.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="classwork" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Tareas y Actividades</h2>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-rose-600 hover:bg-rose-700">
                        <Plus className="mr-2 h-4 w-4" /> Crear
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Crear nueva tarea</DialogTitle>
                        <DialogDescription>
                          Completa los detalles para crear una nueva tarea o actividad.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej. Tarea de Ecuaciones Diferenciales"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Descripción</Label>
                          <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Instrucciones detalladas para la tarea..."
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dueDate">Fecha de entrega</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                          Cancelar
                        </Button>
                        <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleCreateAssignment}>
                          Crear
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  <AssignmentCard
                    title="Problemas de Ecuaciones Diferenciales"
                    dueDate="18 de mayo, 2024"
                    points="100"
                    href="/assignment/1"
                  />
                  <AssignmentCard
                    title="Examen Parcial: Cálculo Integral"
                    dueDate="25 de mayo, 2024"
                    points="200"
                    href="/assignment/2"
                  />
                  <AssignmentCard
                    title="Proyecto Final: Aplicaciones del Álgebra Lineal"
                    dueDate="10 de junio, 2024"
                    points="300"
                    href="/assignment/3"
                  />
                </div>
              </TabsContent>

              <TabsContent value="people" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Profesores</h2>
                    <div className="space-y-2">
                      <PersonCard name="Prof. García" email="garcia@diclass.edu" avatar="PG" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-4">Estudiantes ({classData.students})</h2>
                    <div className="space-y-2">
                      <PersonCard name="Ana Martínez" email="ana.martinez@diclass.edu" avatar="AM" />
                      <PersonCard name="Carlos López" email="carlos.lopez@diclass.edu" avatar="CL" />
                      <PersonCard name="Elena Rodríguez" email="elena.rodriguez@diclass.edu" avatar="ER" />
                      <PersonCard name="Juan Sánchez" email="juan.sanchez@diclass.edu" avatar="JS" />
                      <Button variant="outline" className="w-full mt-2">
                        Ver todos los estudiantes
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="grades" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Calificaciones</CardTitle>
                    <CardDescription>Resumen de calificaciones para esta clase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3">Tarea</th>
                              <th className="text-left p-3">Fecha</th>
                              <th className="text-left p-3">Puntos</th>
                              <th className="text-left p-3">Calificación</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-3">Problemas de Ecuaciones Diferenciales</td>
                              <td className="p-3">18 de mayo, 2024</td>
                              <td className="p-3">100</td>
                              <td className="p-3">-</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-3">Examen Parcial: Cálculo Integral</td>
                              <td className="p-3">25 de mayo, 2024</td>
                              <td className="p-3">200</td>
                              <td className="p-3">-</td>
                            </tr>
                            <tr>
                              <td className="p-3">Proyecto Final: Aplicaciones del Álgebra Lineal</td>
                              <td className="p-3">10 de junio, 2024</td>
                              <td className="p-3">300</td>
                              <td className="p-3">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Entregas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      <span>18 de mayo, 2024</span>
                    </div>
                    <p className="font-medium">Problemas de Ecuaciones Diferenciales</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      <span>25 de mayo, 2024</span>
                    </div>
                    <p className="font-medium">Examen Parcial: Cálculo Integral</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Código de la clase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{classData.code}</p>
                  <Button variant="outline" size="sm">
                    Copiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    </div>
  )
}

function AssignmentCard({
  title,
  dueDate,
  points,
  href,
}: { title: string; dueDate: string; points: string; href: string }) {
  return (
    <Link href={href}>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>
                <div className="flex items-center mt-1">
                  <Clock className="mr-1 h-4 w-4" /> Fecha de entrega: {dueDate}
                </div>
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500">{points} pts</div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="ghost" size="sm" className="text-rose-600">
            Ver detalles
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

function PersonCard({ name, email, avatar }: { name: string; email: string; avatar: string }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={name} />
          <AvatarFallback>{avatar}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
    </div>
  )
}
