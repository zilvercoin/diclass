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
import { Plus, Clock, Users, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { generateClassCode } from "@/lib/utils"
import {
  createClass,
  getClassByCode,
  getStudentClasses,
  getTeacherClasses,
  enrollStudentInClass,
  getAssignmentsByClassId,
} from "@/lib/class"
import DashboardLayout from "../dashboard-layout"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const [className, setClassName] = useState("")
  const [section, setSection] = useState("")
  const [subject, setSubject] = useState("")
  const [classCode, setClassCode] = useState("")
  const [classes, setClasses] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Cargar clases según el rol del usuario
    if (currentUser.role === "teacher") {
      setClasses(getTeacherClasses(currentUser.id))
    } else {
      setClasses(getStudentClasses(currentUser.id))
    }

    // Cargar tareas para el usuario
    const userClasses =
      currentUser.role === "teacher" ? getTeacherClasses(currentUser.id) : getStudentClasses(currentUser.id)

    let allAssignments: any[] = []
    userClasses.forEach((cls) => {
      const classAssignments = getAssignmentsByClassId(cls.id)
      allAssignments = [...allAssignments, ...classAssignments]
    })

    setAssignments(allAssignments)
  }, [router])

  const handleCreateClass = () => {
    if (!className || !section || !subject) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
      })
      return
    }

    // Generar código único para la clase
    const code = generateClassCode()

    // Crear nueva clase
    const newClass = createClass({
      title: className,
      section: section,
      subject: subject,
      teacherId: user.id,
      teacherName: user.name,
      color: `bg-${["blue", "green", "purple", "yellow", "rose", "indigo"][Math.floor(Math.random() * 6)]}-100`,
      code: code,
    })

    // Actualizar estado
    setClasses([...classes, newClass])

    // Mostrar notificación
    toast({
      title: "Clase creada",
      description: `La clase "${className}" ha sido creada exitosamente`,
    })

    // Cerrar diálogo y limpiar campos
    setCreateOpen(false)
    setClassName("")
    setSection("")
    setSubject("")
  }

  const handleJoinClass = () => {
    if (!classCode.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un código de clase",
      })
      return
    }

    // Buscar la clase con el código proporcionado
    const classToJoin = getClassByCode(classCode.trim())

    if (!classToJoin) {
      toast({
        title: "Error",
        description: "No se encontró ninguna clase con ese código",
      })
      return
    }

    // Inscribir al estudiante en la clase
    const enrollment = enrollStudentInClass(classToJoin.id, user.id)

    if (!enrollment) {
      toast({
        title: "Error",
        description: "Ya estás inscrito en esta clase o hubo un problema al unirte",
      })
      return
    }

    // Actualizar estado
    setClasses([...classes, classToJoin])

    // Mostrar notificación
    toast({
      title: "Te has unido a la clase",
      description: `Te has unido exitosamente a "${classToJoin.title}"`,
    })

    // Cerrar diálogo y limpiar campos
    setJoinOpen(false)
    setClassCode("")
  }

  // Filtrar clases según el rol del usuario
  const enrolledClasses = classes.filter((c) => !c.archived)
  const archivedClasses = classes.filter((c) => c.archived)

  if (!user) return null

  return (
    <DashboardLayout>
      <Tabs defaultValue={user?.role === "teacher" ? "teaching" : "enrolled"} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            {user?.role === "student" && <TabsTrigger value="enrolled">Mis Clases</TabsTrigger>}
            {user?.role === "teacher" && <TabsTrigger value="teaching">Impartiendo</TabsTrigger>}
            <TabsTrigger value="archived">Archivadas</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            {user?.role === "student" && (
              <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" /> Unirse a una clase
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Unirse a una clase</DialogTitle>
                    <DialogDescription>Ingresa el código de la clase proporcionado por tu profesor.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="classCode">Código de la clase</Label>
                      <Input
                        id="classCode"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        placeholder="Ej. ABC123XYZ"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setJoinOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleJoinClass}>
                      Unirse
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {user?.role === "teacher" && (
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
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
                    <Button variant="outline" onClick={() => setCreateOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleCreateClass}>
                      Crear
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        {user?.role === "student" && (
          <TabsContent value="enrolled" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrolledClasses.length > 0 ? (
                enrolledClasses.map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    title={classItem.title}
                    teacher={classItem.teacherName}
                    image="/placeholder.svg?height=200&width=400"
                    color={classItem.color}
                    students={classItem.students}
                    href={`/class/${classItem.id}`}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 mb-4">No estás inscrito en ninguna clase</p>
                  <Button variant="outline" onClick={() => setJoinOpen(true)} className="mx-auto">
                    <PlusCircle className="mr-2 h-4 w-4" /> Unirse a una clase
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        )}
        {user?.role === "teacher" && (
          <TabsContent value="teaching" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrolledClasses.length > 0 ? (
                enrolledClasses.map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    title={classItem.title}
                    teacher="Tú"
                    image="/placeholder.svg?height=200&width=400"
                    color={classItem.color}
                    students={classItem.students}
                    href={`/class/${classItem.id}`}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 mb-4">No estás impartiendo ninguna clase</p>
                  <Button variant="outline" onClick={() => setCreateOpen(true)} className="mx-auto">
                    <Plus className="mr-2 h-4 w-4" /> Crear una clase
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        )}
        <TabsContent value="archived" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {archivedClasses.length > 0 ? (
              archivedClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  title={classItem.title}
                  teacher={classItem.teacherName}
                  image="/placeholder.svg?height=200&width=400"
                  color={classItem.color}
                  students={classItem.students}
                  href={`/class/${classItem.id}`}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No tienes clases archivadas</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      {assignments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Próximas Entregas</h2>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                title={assignment.title}
                className={assignment.className || ""}
                dueDate={assignment.dueDate}
                href={`/assignment/${assignment.id}`}
              />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
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
