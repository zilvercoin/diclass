"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Clock, Users } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

// Datos simulados para clases
const initialClasses = [
  {
    id: "1",
    title: "Matemáticas Avanzadas",
    teacher: "Prof. García",
    color: "bg-blue-100",
    students: 24,
    type: "enrolled",
  },
  {
    id: "2",
    title: "Historia Contemporánea",
    teacher: "Prof. Rodríguez",
    color: "bg-green-100",
    students: 18,
    type: "enrolled",
  },
  {
    id: "3",
    title: "Física Cuántica",
    teacher: "Prof. Martínez",
    color: "bg-purple-100",
    students: 15,
    type: "enrolled",
  },
  {
    id: "4",
    title: "Literatura Universal",
    teacher: "Prof. López",
    color: "bg-yellow-100",
    students: 22,
    type: "enrolled",
  },
  {
    id: "5",
    title: "Programación Avanzada",
    teacher: "Tú",
    color: "bg-rose-100",
    students: 20,
    type: "teaching",
  },
  {
    id: "6",
    title: "Diseño Web",
    teacher: "Tú",
    color: "bg-indigo-100",
    students: 16,
    type: "teaching",
  },
  {
    id: "7",
    title: "Álgebra Lineal",
    teacher: "Prof. Sánchez",
    color: "bg-gray-100",
    students: 30,
    type: "archived",
  },
]

// Datos simulados para tareas
const initialAssignments = [
  {
    id: "1",
    title: "Ensayo sobre la Segunda Guerra Mundial",
    className: "Historia Contemporánea",
    dueDate: "15 de mayo, 2024",
  },
  {
    id: "2",
    title: "Problemas de Ecuaciones Diferenciales",
    className: "Matemáticas Avanzadas",
    dueDate: "18 de mayo, 2024",
  },
  {
    id: "3",
    title: "Proyecto Final de Programación",
    className: "Programación Avanzada",
    dueDate: "25 de mayo, 2024",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [className, setClassName] = useState("")
  const [section, setSection] = useState("")
  const [subject, setSubject] = useState("")
  const [classes, setClasses] = useState(initialClasses)
  const [assignments, setAssignments] = useState(initialAssignments)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Cargar datos guardados en localStorage si existen
    const savedClasses = localStorage.getItem("diclass_classes")
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses))
    }

    const savedAssignments = localStorage.getItem("diclass_assignments")
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments))
    }
  }, [router])

  const handleCreateClass = () => {
    if (!className || !section || !subject) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
      })
      return
    }

    // Crear nueva clase
    const newClass = {
      id: Date.now().toString(),
      title: className,
      teacher: user?.role === "teacher" ? "Tú" : "Prof. " + user?.name.split(" ")[0],
      color: `bg-${["blue", "green", "purple", "yellow", "rose", "indigo"][Math.floor(Math.random() * 6)]}-100`,
      students: Math.floor(Math.random() * 20) + 5,
      type: user?.role === "teacher" ? "teaching" : "enrolled",
    }

    // Actualizar estado
    const updatedClasses = [...classes, newClass]
    setClasses(updatedClasses)

    // Guardar en localStorage
    localStorage.setItem("diclass_classes", JSON.stringify(updatedClasses))

    // Mostrar notificación
    toast({
      title: "Clase creada",
      description: `La clase "${className}" ha sido creada exitosamente`,
    })

    // Cerrar diálogo y limpiar campos
    setOpen(false)
    setClassName("")
    setSection("")
    setSubject("")
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <Tabs defaultValue="enrolled" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="enrolled">Mis Clases</TabsTrigger>
              <TabsTrigger value="teaching">Impartiendo</TabsTrigger>
              <TabsTrigger value="archived">Archivadas</TabsTrigger>
            </TabsList>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700">
                  <Plus className="mr-2 h-4 w-4" /> Crear Clase
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear una nueva clase</DialogTitle>
                  <DialogDescription>Completa los detalles para crear una nueva clase.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre de la clase</Label>
                    <Input
                      id="name"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="Ej. Matemáticas Avanzadas"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="section">Sección</Label>
                    <Input
                      id="section"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      placeholder="Ej. Periodo 3"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Asignatura</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ej. Matemáticas"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleCreateClass}>
                    Crear
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <TabsContent value="enrolled" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classes
                .filter((c) => c.type === "enrolled")
                .map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    title={classItem.title}
                    teacher={classItem.teacher}
                    image="/placeholder.svg?height=200&width=400"
                    color={classItem.color}
                    students={classItem.students}
                    href={`/class/${classItem.id}`}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="teaching" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classes
                .filter((c) => c.type === "teaching")
                .map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    title={classItem.title}
                    teacher={classItem.teacher}
                    image="/placeholder.svg?height=200&width=400"
                    color={classItem.color}
                    students={classItem.students}
                    href={`/class/${classItem.id}`}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="archived" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classes
                .filter((c) => c.type === "archived")
                .map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    title={classItem.title}
                    teacher={classItem.teacher}
                    image="/placeholder.svg?height=200&width=400"
                    color={classItem.color}
                    students={classItem.students}
                    href={`/class/${classItem.id}`}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Próximas Entregas</h2>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                title={assignment.title}
                className={assignment.className}
                dueDate={assignment.dueDate}
                href={`/assignment/${assignment.id}`}
              />
            ))}
          </div>
        </div>
      </DashboardShell>
    </div>
  )
}

function ClassCard({
  title,
  teacher,
  image,
  color,
  students,
  href,
}: {
  title: string
  teacher: string
  image: string
  color: string
  students: number
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className={`h-24 ${color}`} />
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{teacher}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="mr-1 h-4 w-4" /> {students} estudiantes
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="text-rose-600">
            Ver clase
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

function AssignmentCard({
  title,
  className,
  dueDate,
  href,
}: {
  title: string
  className: string
  dueDate: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{className}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-4 w-4" /> Fecha de entrega: {dueDate}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
