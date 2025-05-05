"use client"

import { useState, useEffect } from "react"
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
import { BookOpen, Calendar, Clock, FileText, MessageSquare, Plus, Users, Upload } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

// Datos simulados para clases
const classesData = [
  {
    id: "1",
    title: "Matemáticas Avanzadas",
    section: "Periodo 3",
    teacher: "Prof. García",
    description:
      "Curso avanzado de matemáticas que cubre cálculo diferencial e integral, ecuaciones diferenciales y álgebra lineal.",
    students: 24,
    code: "abc123xyz",
    color: "bg-blue-100",
  },
  {
    id: "2",
    title: "Historia Contemporánea",
    section: "Periodo 2",
    teacher: "Prof. Rodríguez",
    description: "Estudio de los eventos históricos desde la Segunda Guerra Mundial hasta la actualidad.",
    students: 18,
    code: "def456uvw",
    color: "bg-green-100",
  },
  {
    id: "3",
    title: "Física Cuántica",
    section: "Periodo 1",
    teacher: "Prof. Martínez",
    description: "Introducción a los principios de la física cuántica y sus aplicaciones.",
    students: 15,
    code: "ghi789rst",
    color: "bg-purple-100",
  },
  {
    id: "4",
    title: "Literatura Universal",
    section: "Periodo 3",
    teacher: "Prof. López",
    description: "Análisis de obras literarias clásicas y contemporáneas de diferentes culturas.",
    students: 22,
    code: "jkl012opq",
    color: "bg-yellow-100",
  },
  {
    id: "5",
    title: "Programación Avanzada",
    section: "Periodo 2",
    teacher: "Tú",
    description: "Desarrollo de habilidades avanzadas de programación en diferentes lenguajes y paradigmas.",
    students: 20,
    code: "mno345hij",
    color: "bg-rose-100",
  },
  {
    id: "6",
    title: "Diseño Web",
    section: "Periodo 1",
    teacher: "Tú",
    description: "Principios y prácticas de diseño web moderno, incluyendo HTML, CSS y JavaScript.",
    students: 16,
    code: "pqr678klm",
    color: "bg-indigo-100",
  },
  {
    id: "7",
    title: "Álgebra Lineal",
    section: "Periodo 3",
    teacher: "Prof. Sánchez",
    description: "Estudio de vectores, matrices, transformaciones lineales y sus aplicaciones.",
    students: 30,
    code: "stu901nop",
    color: "bg-gray-100",
  },
]

// Datos simulados para tareas
const assignmentsData = {
  "1": [
    {
      id: "1",
      title: "Problemas de Ecuaciones Diferenciales",
      dueDate: "18 de mayo, 2024",
      points: "100",
      description:
        "Resuelve los siguientes problemas de ecuaciones diferenciales. Muestra todo tu trabajo y explica tu razonamiento para cada paso.",
    },
    {
      id: "2",
      title: "Examen Parcial: Cálculo Integral",
      dueDate: "25 de mayo, 2024",
      points: "200",
      description: "Examen que cubre los temas de cálculo integral vistos hasta la fecha.",
    },
    {
      id: "3",
      title: "Proyecto Final: Aplicaciones del Álgebra Lineal",
      dueDate: "10 de junio, 2024",
      points: "300",
      description:
        "Desarrolla un proyecto que demuestre la aplicación del álgebra lineal en un problema del mundo real.",
    },
  ],
  "2": [
    {
      id: "4",
      title: "Ensayo sobre la Segunda Guerra Mundial",
      dueDate: "15 de mayo, 2024",
      points: "100",
      description: "Escribe un ensayo analizando las causas y consecuencias de la Segunda Guerra Mundial.",
    },
    {
      id: "5",
      title: "Presentación: La Guerra Fría",
      dueDate: "22 de mayo, 2024",
      points: "150",
      description: "Prepara una presentación sobre un aspecto específico de la Guerra Fría.",
    },
  ],
}

// Datos simulados para anuncios
const announcementsData = {
  "1": [
    {
      id: "1",
      author: "Prof. García",
      avatar: "PG",
      date: "Hoy",
      content:
        "¡Bienvenidos a la clase de Matemáticas Avanzadas! En este curso exploraremos conceptos avanzados de cálculo, álgebra lineal y ecuaciones diferenciales. Por favor, revisen el material de la primera unidad y prepárense para nuestra primera sesión.",
    },
    {
      id: "2",
      author: "Prof. García",
      avatar: "PG",
      date: "Ayer",
      content:
        "He subido los materiales de lectura para la primera unidad. Por favor, revisen los documentos y vengan preparados para la discusión en la próxima clase. Recuerden que tendremos un pequeño cuestionario sobre estos conceptos.",
    },
  ],
  "2": [
    {
      id: "3",
      author: "Prof. Rodríguez",
      avatar: "PR",
      date: "Hoy",
      content:
        "Bienvenidos a Historia Contemporánea. Este semestre estudiaremos los eventos más importantes desde la Segunda Guerra Mundial hasta nuestros días.",
    },
  ],
}

// Datos simulados para estudiantes
const studentsData = {
  "1": [
    { id: "1", name: "Ana Martínez", email: "ana.martinez@diclass.edu", avatar: "AM" },
    { id: "2", name: "Carlos López", email: "carlos.lopez@diclass.edu", avatar: "CL" },
    { id: "3", name: "Elena Rodríguez", email: "elena.rodriguez@diclass.edu", avatar: "ER" },
    { id: "4", name: "Juan Sánchez", email: "juan.sanchez@diclass.edu", avatar: "JS" },
  ],
  "2": [
    { id: "5", name: "María González", email: "maria.gonzalez@diclass.edu", avatar: "MG" },
    { id: "6", name: "Pedro Ramírez", email: "pedro.ramirez@diclass.edu", avatar: "PR" },
    { id: "7", name: "Sofía Torres", email: "sofia.torres@diclass.edu", avatar: "ST" },
  ],
}

export default function ClassPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [points, setPoints] = useState("100")
  const [user, setUser] = useState<any>(null)
  const [classData, setClassData] = useState<any>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [newAnnouncement, setNewAnnouncement] = useState("")
  const [postingAnnouncement, setPostingAnnouncement] = useState(false)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Buscar la clase por ID
    const foundClass = classesData.find((c) => c.id === params.id)
    if (!foundClass) {
      router.push("/dashboard")
      return
    }

    setClassData(foundClass)

    // Cargar tareas, anuncios y estudiantes
    setAssignments(assignmentsData[params.id as keyof typeof assignmentsData] || [])
    setAnnouncements(announcementsData[params.id as keyof typeof announcementsData] || [])
    setStudents(studentsData[params.id as keyof typeof studentsData] || [])

    // Cargar datos guardados en localStorage si existen
    const savedAssignments = localStorage.getItem(`diclass_assignments_${params.id}`)
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments))
    }

    const savedAnnouncements = localStorage.getItem(`diclass_announcements_${params.id}`)
    if (savedAnnouncements) {
      setAnnouncements(JSON.parse(savedAnnouncements))
    }
  }, [params.id, router])

  const handleCreateAssignment = () => {
    if (!title || !description || !dueDate || !points) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
      })
      return
    }

    // Crear nueva tarea
    const newAssignment = {
      id: Date.now().toString(),
      title,
      dueDate,
      points,
      description,
    }

    // Actualizar estado
    const updatedAssignments = [...assignments, newAssignment]
    setAssignments(updatedAssignments)

    // Guardar en localStorage
    localStorage.setItem(`diclass_assignments_${params.id}`, JSON.stringify(updatedAssignments))

    // Mostrar notificación
    toast({
      title: "Tarea creada",
      description: `La tarea "${title}" ha sido creada exitosamente`,
    })

    // Cerrar diálogo y limpiar campos
    setOpen(false)
    setTitle("")
    setDescription("")
    setDueDate("")
    setPoints("100")
  }

  const handlePostAnnouncement = () => {
    if (!newAnnouncement.trim()) {
      toast({
        title: "Error",
        description: "Por favor, escribe un anuncio",
      })
      return
    }

    setPostingAnnouncement(true)

    // Simular retraso de red
    setTimeout(() => {
      // Crear nuevo anuncio
      const newAnnouncementObj = {
        id: Date.now().toString(),
        author: user.name,
        avatar: user.name.substring(0, 2).toUpperCase(),
        date: "Ahora",
        content: newAnnouncement,
      }

      // Actualizar estado
      const updatedAnnouncements = [newAnnouncementObj, ...announcements]
      setAnnouncements(updatedAnnouncements)

      // Guardar en localStorage
      localStorage.setItem(`diclass_announcements_${params.id}`, JSON.stringify(updatedAnnouncements))

      // Mostrar notificación
      toast({
        title: "Anuncio publicado",
        description: "Tu anuncio ha sido publicado exitosamente",
      })

      // Limpiar campo y estado
      setNewAnnouncement("")
      setPostingAnnouncement(false)
    }, 1000)
  }

  if (!user || !classData) return null

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
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Comparte algo con tu clase</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 items-start">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Comparte un anuncio, pregunta o material..."
                          value={newAnnouncement}
                          onChange={(e) => setNewAnnouncement(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-1" /> Adjuntar
                            </Button>
                          </div>
                          <Button
                            onClick={handlePostAnnouncement}
                            disabled={!newAnnouncement.trim() || postingAnnouncement}
                            className="bg-rose-600 hover:bg-rose-700"
                          >
                            {postingAnnouncement ? "Publicando..." : "Publicar"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="mb-4">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={announcement.author} />
                          <AvatarFallback>{announcement.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{announcement.author}</CardTitle>
                          <CardDescription>Publicado {announcement.date}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
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
                        <div className="grid gap-2">
                          <Label htmlFor="points">Puntos</Label>
                          <Input id="points" type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
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
                  {assignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      title={assignment.title}
                      dueDate={assignment.dueDate}
                      points={assignment.points}
                      href={`/assignment/${assignment.id}`}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="people" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Profesores</h2>
                    <div className="space-y-2">
                      <PersonCard
                        name={classData.teacher}
                        email={`${classData.teacher.toLowerCase().replace("prof. ", "")}@diclass.edu`}
                        avatar={classData.teacher.substring(0, 2).toUpperCase()}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-4">Estudiantes ({classData.students})</h2>
                    <div className="space-y-2">
                      {students.map((student) => (
                        <PersonCard
                          key={student.id}
                          name={student.name}
                          email={student.email}
                          avatar={student.avatar}
                        />
                      ))}
                      {students.length < classData.students && (
                        <Button variant="outline" className="w-full mt-2">
                          Ver todos los estudiantes
                        </Button>
                      )}
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
                            {assignments.map((assignment) => (
                              <tr key={assignment.id} className="border-b">
                                <td className="p-3">{assignment.title}</td>
                                <td className="p-3">{assignment.dueDate}</td>
                                <td className="p-3">{assignment.points}</td>
                                <td className="p-3">-</td>
                              </tr>
                            ))}
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
                  {assignments.slice(0, 2).map((assignment) => (
                    <div key={assignment.id} className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{assignment.dueDate}</span>
                      </div>
                      <p className="font-medium">{assignment.title}</p>
                    </div>
                  ))}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(classData.code)
                      toast({
                        title: "Código copiado",
                        description: "El código de la clase ha sido copiado al portapapeles",
                      })
                    }}
                  >
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
}: {
  title: string
  dueDate: string
  points: string
  href: string
}) {
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
