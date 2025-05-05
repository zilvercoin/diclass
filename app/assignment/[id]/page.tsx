"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, FileText, Check, ExternalLink } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useRouter } from "next/navigation"
import { getCurrentUser, recordActivity } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { FileUpload, type FileItem } from "@/components/file-upload"
import { FileViewer } from "@/components/file-viewer"
import {
  getAssignmentById,
  getClassById,
  getCommentsByReference,
  createComment,
  getSubmissionByAssignmentAndStudent,
  createSubmission,
  updateSubmission,
  getSubmissionsByAssignmentId,
  getClassStudents,
} from "@/lib/class"
import { notifySubmission, notifyComment, notifyGrade, getRemainingTime } from "@/lib/notifications"

export default function AssignmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [assignment, setAssignment] = useState<any>(null)
  const [classData, setClassData] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [submissionFiles, setSubmissionFiles] = useState<FileItem[]>([])
  const [submission, setSubmission] = useState<any>(null)
  const [studentSubmissions, setStudentSubmissions] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [grading, setGrading] = useState<{ [key: string]: string }>({})
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({})
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Cargar datos de la tarea
    const assignmentData = getAssignmentById(params.id)
    if (!assignmentData) {
      toast({
        title: "Error",
        description: "No se encontró la tarea",
      })
      router.push("/dashboard")
      return
    }

    setAssignment(assignmentData)

    // Cargar datos de la clase
    const classInfo = getClassById(assignmentData.classId)
    if (classInfo) {
      setClassData(classInfo)

      // Cargar estudiantes de la clase
      const classStudents = getClassStudents(classInfo.id)
      setStudents(classStudents)
    }

    // Cargar comentarios
    const assignmentComments = getCommentsByReference("assignment", params.id)
    setComments(assignmentComments)

    // Si es estudiante, cargar su entrega
    if (currentUser.role === "student") {
      const studentSubmission = getSubmissionByAssignmentAndStudent(params.id, currentUser.id)
      if (studentSubmission) {
        setSubmission(studentSubmission)
        if (studentSubmission.files) {
          setSubmissionFiles(studentSubmission.files)
        }
      }
    }
    // Si es profesor, cargar todas las entregas
    else if (currentUser.role === "teacher") {
      const allSubmissions = getSubmissionsByAssignmentId(params.id)
      setStudentSubmissions(allSubmissions)

      // Inicializar estados para calificaciones y feedback
      const initialGrading: { [key: string]: string } = {}
      const initialFeedback: { [key: string]: string } = {}

      allSubmissions.forEach((sub) => {
        initialGrading[sub.studentId] = sub.grade || ""
        initialFeedback[sub.studentId] = sub.feedback || ""
      })

      setGrading(initialGrading)
      setFeedback(initialFeedback)
    }
  }, [params.id, router])

  const handleSubmitComment = () => {
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Por favor, escribe un comentario",
      })
      return
    }

    setSubmitting(true)

    // Crear nuevo comentario
    const newComment = createComment({
      type: "assignment",
      referenceId: params.id,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar || user.name.substring(0, 2).toUpperCase(),
      content: comment,
    })

    // Registrar actividad
    recordActivity({
      userId: user.id,
      type: "comment",
      referenceId: params.id,
      referenceName: assignment.title,
      description: `Comentaste en la tarea "${assignment.title}"`,
    })

    // Notificar a los demás usuarios
    const recipientIds = [
      classData.teacherId, // Profesor
      ...students.map((student) => student.id), // Estudiantes
    ].filter((id) => id !== user.id) // Excluir al autor

    notifyComment("assignment", params.id, assignment.title, user.id, user.name, recipientIds)

    // Actualizar estado
    setComments([...comments, newComment])

    // Mostrar notificación
    toast({
      title: "Comentario enviado",
      description: "Tu comentario ha sido publicado exitosamente",
    })

    // Limpiar campo y estado
    setComment("")
    setSubmitting(false)
  }

  const handleSubmitAssignment = () => {
    if (submissionFiles.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, adjunta al menos un archivo o enlace",
      })
      return
    }

    setSubmitting(true)

    // Crear o actualizar entrega
    let newSubmission

    if (submission) {
      // Actualizar entrega existente
      newSubmission = {
        ...submission,
        status: "submitted",
        submittedAt: new Date().toISOString(),
        files: submissionFiles,
      }

      // Actualizar la entrega en el sistema
      updateSubmission(submission.id, newSubmission)
    } else {
      // Crear nueva entrega
      newSubmission = createSubmission({
        assignmentId: params.id,
        studentId: user.id,
        status: "submitted",
        submittedAt: new Date().toISOString(),
        files: submissionFiles,
      })
    }

    setSubmission(newSubmission)

    // Registrar actividad
    recordActivity({
      userId: user.id,
      type: "submission",
      referenceId: params.id,
      referenceName: assignment.title,
      description: `Entregaste la tarea "${assignment.title}"`,
    })

    // Notificar al profesor
    notifySubmission(params.id, assignment.title, user.id, user.name, classData.teacherId)

    // Mostrar notificación
    toast({
      title: "Tarea entregada",
      description: `Tu entrega ha sido registrada exitosamente`,
    })

    setSubmitting(false)
  }

  const handleGradeSubmission = (studentId: string) => {
    const submissionToGrade = studentSubmissions.find((sub) => sub.studentId === studentId)

    if (!submissionToGrade) {
      toast({
        title: "Error",
        description: "No se encontró la entrega del estudiante",
      })
      return
    }

    // Validar calificación
    const grade = grading[studentId]
    if (!grade || isNaN(Number(grade)) || Number(grade) < 0 || Number(grade) > Number(assignment.points)) {
      toast({
        title: "Error",
        description: `La calificación debe ser un número entre 0 y ${assignment.points}`,
      })
      return
    }

    // Actualizar la entrega con la calificación
    const updatedSubmission = {
      ...submissionToGrade,
      grade: grade,
      feedback: feedback[studentId] || "",
      status: "graded",
    }

    updateSubmission(submissionToGrade.id, updatedSubmission)

    // Registrar actividad
    recordActivity({
      userId: user.id,
      type: "grade",
      referenceId: params.id,
      referenceName: assignment.title,
      description: `Calificaste la entrega de ${getStudentName(studentId)} para la tarea "${assignment.title}"`,
    })

    // Notificar al estudiante
    notifyGrade(params.id, assignment.title, studentId, grade)

    // Actualizar la lista de entregas
    setStudentSubmissions(studentSubmissions.map((sub) => (sub.id === submissionToGrade.id ? updatedSubmission : sub)))

    toast({
      title: "Calificación guardada",
      description: "La calificación ha sido guardada exitosamente",
    })
  }

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    return student ? student.name : "Estudiante"
  }

  const handleViewFile = (file: FileItem) => {
    setSelectedFile(file)
  }

  const isTeacher = user && classData && user.id === classData.teacherId
  const isStudent = user && user.role === "student"
  const submissionStatus = submission ? submission.status : "No entregado"

  if (!user || !assignment) return null

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{assignment.title}</CardTitle>
                    <CardDescription>
                      {classData && (
                        <Link href={`/class/${assignment.classId}`} className="text-rose-600 hover:underline">
                          {classData.title}
                        </Link>
                      )}
                      {classData && <span> • {classData.teacherName}</span>}
                    </CardDescription>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      Fecha de entrega: {assignment.dueDate}
                      {assignment.dueTime && ` a las ${assignment.dueTime}`}
                    </div>
                    {isStudent && (
                      <div className="text-xs mt-1 text-gray-500">
                        Tiempo restante: {getRemainingTime(assignment.dueDate, assignment.dueTime)}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{assignment.points} pts</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{assignment.description}</p>
                  </div>
                  {assignment.materials && assignment.materials.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Material de referencia:</h3>
                      <div className="flex flex-wrap gap-2">
                        {assignment.materials.map((material: FileItem) => (
                          <div
                            key={material.id}
                            className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-accent"
                            onClick={() => handleViewFile(material)}
                          >
                            {material.isLink ? (
                              <>
                                <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                                <span className="text-blue-600">{material.name}</span>
                              </>
                            ) : (
                              <>
                                <FileText className="h-5 w-5 mr-2 text-gray-500" />
                                <span>{material.name}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Comentarios de la clase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar>
                        <AvatarImage
                          src={
                            comment.authorAvatar?.startsWith("data:")
                              ? comment.authorAvatar
                              : "/placeholder.svg?height=40&width=40"
                          }
                          alt={comment.authorName}
                        />
                        <AvatarFallback>{comment.authorAvatar}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">{comment.authorName}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(comment.createdAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-line">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-4 items-start mt-6">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Añadir un comentario a la clase..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button
                        onClick={handleSubmitComment}
                        disabled={!comment.trim() || submitting}
                        className="bg-rose-600 hover:bg-rose-700"
                      >
                        {submitting ? "Enviando..." : "Enviar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-1/3">
            {isStudent && (
              <Card>
                <CardHeader>
                  <CardTitle>Tu trabajo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FileUpload
                      onFilesChange={setSubmissionFiles}
                      currentFiles={submissionFiles}
                      acceptedTypes="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                    />

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Estado:</span> {submissionStatus}
                      </div>
                      <Button
                        className="bg-rose-600 hover:bg-rose-700"
                        disabled={submissionFiles.length === 0 || submitting || submissionStatus === "graded"}
                        onClick={handleSubmitAssignment}
                      >
                        {submitting ? "Entregando..." : "Entregar"}
                      </Button>
                    </div>

                    {submission && submission.files && submission.files.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Archivos entregados:</h3>
                        <div className="flex flex-wrap gap-2">
                          {submission.files.map((file: FileItem) => (
                            <div
                              key={file.id}
                              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-accent"
                              onClick={() => handleViewFile(file)}
                            >
                              {file.isLink ? (
                                <>
                                  <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                                  <span className="text-sm text-blue-600">{file.name}</span>
                                </>
                              ) : (
                                <>
                                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                  <span className="text-sm">{file.name}</span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {submission && submission.grade && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-medium text-green-800 mb-2">Calificación</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-green-800 font-bold text-lg">
                            {submission.grade}/{assignment.points}
                          </span>
                          <span className="text-green-700 text-sm">
                            {Math.round((Number(submission.grade) / Number(assignment.points)) * 100)}%
                          </span>
                        </div>
                        {submission.feedback && (
                          <div className="mt-2 pt-2 border-t border-green-200">
                            <h4 className="text-sm font-medium text-green-800">Comentarios del profesor:</h4>
                            <p className="text-sm text-green-700">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {isTeacher && (
              <Card>
                <CardHeader>
                  <CardTitle>Entregas de estudiantes</CardTitle>
                </CardHeader>
                <CardContent>
                  {studentSubmissions.length > 0 ? (
                    <div className="space-y-4">
                      {studentSubmissions.map((sub) => (
                        <Card key={sub.id} className="border">
                          <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center justify-between">
                              <span>{getStudentName(sub.studentId)}</span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  sub.status === "graded"
                                    ? "bg-green-100 text-green-800"
                                    : sub.status === "submitted"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {sub.status === "graded"
                                  ? "Calificado"
                                  : sub.status === "submitted"
                                    ? "Entregado"
                                    : "Pendiente"}
                              </span>
                            </CardTitle>
                            <CardDescription>
                              Entregado:{" "}
                              {new Date(sub.submittedAt).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="py-3">
                            {sub.files && sub.files.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium mb-2">Archivos:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {sub.files.map((file: FileItem) => (
                                    <div
                                      key={file.id}
                                      className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-accent"
                                      onClick={() => handleViewFile(file)}
                                    >
                                      {file.isLink ? (
                                        <>
                                          <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                                          <span className="text-sm text-blue-600">{file.name}</span>
                                        </>
                                      ) : (
                                        <>
                                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                          <span className="text-sm">{file.name}</span>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="space-y-3">
                              <div>
                                <Label htmlFor={`grade-${sub.id}`} className="text-sm font-medium">
                                  Calificación (máx. {assignment.points})
                                </Label>
                                <div className="flex items-center mt-1">
                                  <Input
                                    id={`grade-${sub.id}`}
                                    type="number"
                                    min="0"
                                    max={assignment.points}
                                    value={grading[sub.studentId] || ""}
                                    onChange={(e) => setGrading({ ...grading, [sub.studentId]: e.target.value })}
                                    className="w-20 mr-2"
                                  />
                                  <span className="text-sm text-gray-500">/ {assignment.points}</span>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor={`feedback-${sub.id}`} className="text-sm font-medium">
                                  Comentarios para el estudiante
                                </Label>
                                <Textarea
                                  id={`feedback-${sub.id}`}
                                  value={feedback[sub.studentId] || ""}
                                  onChange={(e) => setFeedback({ ...feedback, [sub.studentId]: e.target.value })}
                                  className="mt-1 min-h-[80px]"
                                  placeholder="Añade comentarios sobre la entrega..."
                                />
                              </div>

                              <Button
                                className="w-full bg-rose-600 hover:bg-rose-700"
                                onClick={() => handleGradeSubmission(sub.studentId)}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                {sub.status === "graded" ? "Actualizar calificación" : "Calificar entrega"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Aún no hay entregas de estudiantes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Fecha de entrega:</span>
                    <span className="text-sm">{assignment.dueDate}</span>
                  </div>
                  {assignment.dueTime && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Hora de entrega:</span>
                      <span className="text-sm">{assignment.dueTime}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Puntos:</span>
                    <span className="text-sm">{assignment.points}</span>
                  </div>
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
