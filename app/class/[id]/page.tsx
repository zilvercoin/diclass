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
import { BookOpen, Calendar, Clock, FileText, MessageSquare, Plus, Users, ExternalLink } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useRouter } from "next/navigation"
import { getCurrentUser, recordActivity } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { FileUpload, type FileItem } from "@/components/file-upload"
import { FileViewer } from "@/components/file-viewer"
import {
  getClassById,
  getClassStudents,
  getAssignmentsByClassId,
  createAssignment,
  getAnnouncementsByClassId,
  createAnnouncement,
  getSubmissionsByAssignmentId,
  getSubmissionsByStudentId,
} from "@/lib/class"
import { notifyNewAssignment, notifyComment, getRemainingTime } from "@/lib/notifications"

export default function ClassPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [points, setPoints] = useState("100")
  const [materials, setMaterials] = useState<FileItem[]>([])
  const [user, setUser] = useState<any>(null)
  const [classData, setClassData] = useState<any>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [newAnnouncement, setNewAnnouncement] = useState("")
  const [announcementFiles, setAnnouncementFiles] = useState<FileItem[]>([])
  const [postingAnnouncement, setPostingAnnouncement] = useState(false)
  const [studentSubmissions, setStudentSubmissions] = useState<{ [key: string]: any[] }>({})
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Cargar datos de la clase
    const classInfo = getClassById(params.id)
    if (!classInfo) {
      toast({
        title: "Error",
        description: "No se encontró la clase",
      })
      router.push("/dashboard")
      return
    }

    setClassData(classInfo)

    // Cargar tareas de la clase
    const classAssignments = getAssignmentsByClassId(params.id)
    setAssignments(classAssignments)

    // Cargar anuncios de la clase
    const classAnnouncements = getAnnouncementsByClassId(params.id)
    setAnnouncements(classAnnouncements)

    // Cargar estudiantes de la clase
    const classStudents = getClassStudents(classInfo.id)
    setStudents(classStudents)

    // Si es profesor, cargar todas las entregas para cada tarea
    if (currentUser.role === "teacher") {
      const submissionsByAssignment: { [key: string]: any[] } = {}

      classAssignments.forEach((assignment) => {
        submissionsByAssignment[assignment.id] = getSubmissionsByAssignmentId(assignment.id)
      })

      setStudentSubmissions(submissionsByAssignment)
    }
    // Si es estudiante, cargar sus entregas
    else if (currentUser.role === "student") {
      const studentSubs = getSubmissionsByStudentId(currentUser.id)

      // Organizar por tarea
      const submissionsByAssignment: { [key: string]: any[] } = {}
      studentSubs.forEach((sub) => {
        if (!submissionsByAssignment[sub.assignmentId]) {
          submissionsByAssignment[sub.assignmentId] = []
        }
        submissionsByAssignment[sub.assignmentId].push(sub)
      })

      setStudentSubmissions(submissionsByAssignment)
    }
  }, [params.id, router])

  const handleCreateAssignment = () => {
    if (!title || !description || !dueDate) {
      toast({
        title: "Error",
        description: "Por favor, completa los campos obligatorios",
      })
      return
    }

    // Crear nueva tarea
    const newAssignment = createAssignment({
      classId: params.id,
      title,
      description,
      dueDate,
      dueTime,
      points,
      materials: materials,
    })

    // Registrar actividad
    recordActivity({
      userId: user.id,
      type: "creation",
      referenceId: newAssignment.id,
      referenceName: newAssignment.title,
      description: `Creaste la tarea "${newAssignment.title}" en la clase "${classData.title}"`,
    })

    // Notificar a los estudiantes
    notifyNewAssignment(
      newAssignment.id,
      newAssignment.title,
      params.id,
      classData.title,
      students.map((student) => student.id),
    )

    // Actualizar estado
    setAssignments([...assignments, newAssignment])

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
    setDueTime("")
    setPoints("100")
    setMaterials([])
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

    // Crear nuevo anuncio
    const newAnnouncementObj = createAnnouncement({
      classId: params.id,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar || user.name.substring(0, 2).toUpperCase(),
      content: newAnnouncement,
      materials: announcementFiles,
    })

    // Registrar actividad
    recordActivity({
      userId: user.id,
      type: "creation",
      referenceId: newAnnouncementObj.id,
      referenceName: "Anuncio",
      description: `Publicaste un anuncio en la clase "${classData.title}"`,
    })

    // Notificar a los estudiantes
    notifyComment(
      "announcement",
      params.id,
      classData.title,
      user.id,
      user.name,
      students.map((student) => student.id),
    )

    // Actualizar estado
    setAnnouncements([newAnnouncementObj, ...announcements])

    // Mostrar notificación
    toast({
      title: "Anuncio publicado",
      description: "Tu anuncio ha sido publicado exitosamente",
    })

    // Limpiar campo y estado
    setNewAnnouncement("")
    setAnnouncementFiles([])
    setPostingAnnouncement(false)
  }

  const copyClassCode = () => {
    if (classData && classData.code) {
      navigator.clipboard.writeText(classData.code)
      toast({
        title: "Código copiado",
        description: "El código de la clase ha sido copiado al portapapeles",
      })
    }
  }

  const handleViewFile = (file: FileItem) => {
    setSelectedFile(file)
  }

  const isTeacher = user && classData && user.id === classData.teacherId

  // Función para obtener la calificación de un estudiante para una tarea
  const getStudentGrade = (assignmentId: string, studentId: string) => {
    const submissions = studentSubmissions[assignmentId] || []
    const submission = submissions.find((sub) => sub.studentId === studentId)
    return submission ? submission.grade : "-"
  }

  // Función para obtener el estado de entrega de un estudiante para una tarea
  const getSubmissionStatus = (assignmentId: string, studentId: string) => {
    const submissions = studentSubmissions[assignmentId] || []
    const submission = submissions.find((sub) => sub.studentId === studentId)
    return submission ? submission.status : "missing"
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
                        <FileUpload onFilesChange={setAnnouncementFiles} currentFiles={announcementFiles} />
                        <div className="flex justify-end">
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

                {announcements.length > 0 ? (
                  announcements.map((announcement) => (
                    <Card key={announcement.id} className="mb-4">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={
                                announcement.authorAvatar?.startsWith("data:")
                                  ? announcement.authorAvatar
                                  : "/placeholder.svg?height=40&width=40"
                              }
                              alt={announcement.authorName}
                            />
                            <AvatarFallback>{announcement.authorAvatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{announcement.authorName}</CardTitle>
                            <CardDescription>
                              {new Date(announcement.createdAt).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line">{announcement.content}</p>

                        {announcement.materials && announcement.materials.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Archivos adjuntos:</h4>
                            <div className="flex flex-wrap gap-2">
                              {announcement.materials.map((material: FileItem) => (
                                <div
                                  key={material.id}
                                  className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-accent"
                                  onClick={() => handleViewFile(material)}
                                >
                                  {material.isLink ? (
                                    <>
                                      <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                                      <span className="text-sm text-blue-600">{material.name}</span>
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                      <span className="text-sm">{material.name}</span>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No hay anuncios en esta clase</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="classwork" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Tareas y Actividades</h2>
                  {isTeacher && (
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-rose-600 hover:bg-rose-700">
                          <Plus className="mr-2 h-4 w-4" /> Crear
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
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
                              className="min-h-[120px]"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <Label htmlFor="dueTime">Hora de entrega</Label>
                              <Input
                                id="dueTime"
                                type="time"
                                value={dueTime}
                                onChange={(e) => setDueTime(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="points">Puntos</Label>
                            <Input
                              id="points"
                              type="number"
                              value={points}
                              onChange={(e) => setPoints(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Materiales</Label>
                            <FileUpload
                              onFilesChange={setMaterials}
                              currentFiles={materials}
                              acceptedTypes="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
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
                  )}
                </div>

                <div className="space-y-4">
                  {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                      <AssignmentCard
                        key={assignment.id}
                        title={assignment.title}
                        dueDate={assignment.dueDate}
                        dueTime={assignment.dueTime}
                        points={assignment.points}
                        href={`/assignment/${assignment.id}`}
                        status={user.role === "student" ? getSubmissionStatus(assignment.id, user.id) : undefined}
                        remainingTime={
                          user.role === "student" ? getRemainingTime(assignment.dueDate, assignment.dueTime) : undefined
                        }
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No hay tareas en esta clase</p>
                      {isTeacher && (
                        <Button variant="outline" onClick={() => setOpen(true)} className="mt-4">
                          <Plus className="mr-2 h-4 w-4" /> Crear tarea
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="people" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Profesores</h2>
                    <div className="space-y-2">
                      <PersonCard
                        name={classData.teacherName}
                        email={`${classData.teacherName.toLowerCase().replace(" ", ".")}@diclass.edu`}
                        avatar={classData.teacherName.substring(0, 2).toUpperCase()}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-4">Estudiantes ({classData.students || 0})</h2>
                    <div className="space-y-2">
                      {students.length > 0 ? (
                        students.map((student) => (
                          <PersonCard
                            key={student.id}
                            name={student.name}
                            email={student.email}
                            avatar={student.avatar || student.name.substring(0, 2).toUpperCase()}
                          />
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500">No hay estudiantes en esta clase</p>
                        </div>
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
                    {assignments.length > 0 ? (
                      <div className="space-y-4">
                        {isTeacher ? (
                          // Vista de calificaciones para profesor
                          <div className="border rounded-lg overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-3">Estudiante</th>
                                  {assignments.map((assignment) => (
                                    <th key={assignment.id} className="text-left p-3">
                                      <div className="font-medium">{assignment.title}</div>
                                      <div className="text-xs text-gray-500">{assignment.points} pts</div>
                                    </th>
                                  ))}
                                  <th className="text-left p-3">Promedio</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students.map((student) => {
                                  // Calcular promedio
                                  let totalPoints = 0
                                  let earnedPoints = 0
                                  let gradedAssignments = 0

                                  assignments.forEach((assignment) => {
                                    const grade = getStudentGrade(assignment.id, student.id)
                                    if (grade !== "-") {
                                      totalPoints += Number(assignment.points)
                                      earnedPoints += Number(grade)
                                      gradedAssignments++
                                    }
                                  })

                                  const average =
                                    gradedAssignments > 0 ? Math.round((earnedPoints / totalPoints) * 100) : "-"

                                  return (
                                    <tr key={student.id} className="border-b">
                                      <td className="p-3">
                                        <div className="font-medium">{student.name}</div>
                                        <div className="text-xs text-gray-500">{student.email}</div>
                                      </td>
                                      {assignments.map((assignment) => {
                                        const grade = getStudentGrade(assignment.id, student.id)
                                        const status = getSubmissionStatus(assignment.id, student.id)

                                        return (
                                          <td key={`${student.id}-${assignment.id}`} className="p-3">
                                            <Link href={`/assignment/${assignment.id}`} className="hover:underline">
                                              <div
                                                className={`font-medium ${
                                                  status === "graded"
                                                    ? "text-green-600"
                                                    : status === "submitted"
                                                      ? "text-blue-600"
                                                      : "text-red-600"
                                                }`}
                                              >
                                                {grade !== "-" ? `${grade}/${assignment.points}` : "-"}
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                {status === "graded"
                                                  ? "Calificado"
                                                  : status === "submitted"
                                                    ? "Entregado"
                                                    : "No entregado"}
                                              </div>
                                            </Link>
                                          </td>
                                        )
                                      })}
                                      <td className="p-3">
                                        <div className="font-medium">{average !== "-" ? `${average}%` : "-"}</div>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          // Vista de calificaciones para estudiante
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
                                {assignments.map((assignment) => {
                                  const grade = getStudentGrade(assignment.id, user.id)
                                  const status = getSubmissionStatus(assignment.id, user.id)

                                  return (
                                    <tr key={assignment.id} className="border-b">
                                      <td className="p-3">
                                        <Link href={`/assignment/${assignment.id}`} className="hover:underline">
                                          {assignment.title}
                                        </Link>
                                      </td>
                                      <td className="p-3">{assignment.dueDate}</td>
                                      <td className="p-3">{assignment.points}</td>
                                      <td className="p-3">
                                        <div
                                          className={`font-medium ${
                                            status === "graded"
                                              ? "text-green-600"
                                              : status === "submitted"
                                                ? "text-blue-600"
                                                : "text-red-600"
                                          }`}
                                        >
                                          {grade !== "-" ? grade : "-"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {status === "graded"
                                            ? "Calificado"
                                            : status === "submitted"
                                              ? "Entregado"
                                              : "No entregado"}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No hay tareas para calificar</p>
                      </div>
                    )}
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
                  {assignments.length > 0 ? (
                    assignments.slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          <span>{assignment.dueDate}</span>
                        </div>
                        <p className="font-medium">{assignment.title}</p>
                        {user.role === "student" && (
                          <p className="text-xs text-gray-500">
                            Tiempo restante: {getRemainingTime(assignment.dueDate, assignment.dueTime)}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No hay entregas próximas</p>
                  )}
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
                  <Button variant="outline" size="sm" onClick={copyClassCode}>
                    Copiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>

      {/* Visor de archivos */}
      <FileViewer file={selectedFile} onClose={() => setSelectedFile(null)} />
    </div>
  )
}

function AssignmentCard({
  title,
  dueDate,
  dueTime,
  points,
  href,
  status,
  remainingTime,
}: {
  title: string
  dueDate: string
  dueTime?: string
  points: string
  href: string
  status?: string
  remainingTime?: string
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
                  <Clock className="mr-1 h-4 w-4" />
                  Fecha de entrega: {dueDate}
                  {dueTime && ` a las ${dueTime}`}
                </div>
                {remainingTime && <div className="text-xs mt-1">Tiempo restante: {remainingTime}</div>}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-500">{points} pts</div>
              {status && (
                <div
                  className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                    status === "graded"
                      ? "bg-green-100 text-green-800"
                      : status === "submitted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {status === "graded" ? "Calificado" : status === "submitted" ? "Entregado" : "No entregado"}
                </div>
              )}
            </div>
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
          <AvatarImage src={avatar?.startsWith("data:") ? avatar : "/placeholder.svg?height=40&width=40"} alt={name} />
          <AvatarFallback>{avatar.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
    </div>
  )
}
