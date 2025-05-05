"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, FileText, Upload } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

// Datos simulados para tareas
const assignmentsData = [
  {
    id: "1",
    title: "Problemas de Ecuaciones Diferenciales",
    description:
      "Resuelve los siguientes problemas de ecuaciones diferenciales. Muestra todo tu trabajo y explica tu razonamiento para cada paso.",
    dueDate: "18 de mayo, 2024",
    points: "100",
    class: "Matemáticas Avanzadas",
    classId: "1",
    teacher: "Prof. García",
    status: "Asignado",
    details: `
      <ol class="list-decimal pl-5 space-y-2">
        <li>Resuelve la ecuación diferencial: dy/dx + P(x)y = Q(x)</li>
        <li>Encuentra la solución general de: y'' - 4y' + 4y = 0</li>
        <li>Resuelve el problema de valor inicial: y' + 2y = 4, y(0) = 1</li>
        <li>Encuentra la solución particular de: y'' + y = sin(x)</li>
        <li>Utiliza el método de variación de parámetros para resolver: y'' + y = sec(x)</li>
      </ol>
      <p class="mt-4">
        Recuerda mostrar todos los pasos de tu solución y explicar tu razonamiento. Las respuestas sin
        trabajo mostrado no recibirán crédito completo.
      </p>
    `,
  },
  {
    id: "2",
    title: "Examen Parcial: Cálculo Integral",
    description: "Examen que cubre los temas de cálculo integral vistos hasta la fecha.",
    dueDate: "25 de mayo, 2024",
    points: "200",
    class: "Matemáticas Avanzadas",
    classId: "1",
    teacher: "Prof. García",
    status: "Asignado",
    details: `
      <p>Este examen evaluará tu comprensión de los siguientes temas:</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Integrales definidas e indefinidas</li>
        <li>Técnicas de integración</li>
        <li>Aplicaciones de la integral</li>
        <li>Integrales impropias</li>
      </ul>
      <p class="mt-4">
        El examen tendrá una duración de 2 horas. Se permitirá el uso de una hoja de fórmulas (una cara).
      </p>
    `,
  },
  {
    id: "3",
    title: "Proyecto Final: Aplicaciones del Álgebra Lineal",
    description: "Desarrolla un proyecto que demuestre la aplicación del álgebra lineal en un problema del mundo real.",
    dueDate: "10 de junio, 2024",
    points: "300",
    class: "Matemáticas Avanzadas",
    classId: "1",
    teacher: "Prof. García",
    status: "Asignado",
    details: `
      <p>Para este proyecto, deberás:</p>
      <ol class="list-decimal pl-5 space-y-2">
        <li>Identificar un problema del mundo real que pueda ser modelado usando álgebra lineal</li>
        <li>Desarrollar un modelo matemático usando conceptos de álgebra lineal</li>
        <li>Implementar una solución computacional (si es aplicable)</li>
        <li>Analizar los resultados y discutir las limitaciones del modelo</li>
        <li>Presentar tu trabajo en un informe escrito y una presentación oral</li>
      </ol>
      <p class="mt-4">
        El informe debe tener entre 8-10 páginas y seguir el formato APA. La presentación oral será de 10 minutos.
      </p>
    `,
  },
  {
    id: "4",
    title: "Ensayo sobre la Segunda Guerra Mundial",
    description: "Escribe un ensayo analizando las causas y consecuencias de la Segunda Guerra Mundial.",
    dueDate: "15 de mayo, 2024",
    points: "100",
    class: "Historia Contemporánea",
    classId: "2",
    teacher: "Prof. Rodríguez",
    status: "Asignado",
    details: `
      <p>Escribe un ensayo de 1500-2000 palabras sobre la Segunda Guerra Mundial, abordando los siguientes aspectos:</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Causas políticas, económicas y sociales que llevaron al conflicto</li>
        <li>Eventos clave que marcaron el desarrollo de la guerra</li>
        <li>Consecuencias a corto y largo plazo para Europa y el mundo</li>
        <li>Análisis crítico de cómo este conflicto transformó el orden mundial</li>
      </ul>
      <p class="mt-4">
        Tu ensayo debe incluir al menos 5 fuentes académicas y seguir el formato MLA para citas y referencias.
      </p>
    `,
  },
]

// Datos simulados para comentarios
const commentsData = {
  "1": [
    {
      id: "1",
      author: "Juan Sánchez",
      avatar: "JS",
      date: "Hace 2 horas",
      content:
        "¿Podemos usar el método de coeficientes indeterminados para el problema 4 en lugar del método de variación de parámetros?",
    },
    {
      id: "2",
      author: "Prof. García",
      avatar: "PG",
      date: "Hace 1 hora",
      content:
        "Sí, Juan. Puedes usar el método de coeficientes indeterminados para el problema 4, ya que la función del lado derecho es sin(x). Para el problema 5, sin embargo, necesitarás usar variación de parámetros debido a la función secante.",
    },
  ],
  "4": [
    {
      id: "3",
      author: "María González",
      avatar: "MG",
      date: "Hace 3 horas",
      content:
        "¿Podemos enfocarnos en un aspecto específico de la guerra, como el frente del Pacífico, o debemos cubrir todo el conflicto?",
    },
    {
      id: "4",
      author: "Prof. Rodríguez",
      avatar: "PR",
      date: "Hace 2 horas",
      content:
        "Puedes enfocarte en un aspecto específico, María, siempre que contextualices adecuadamente y expliques su relevancia en el marco general del conflicto.",
    },
  ],
}

export default function AssignmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [assignment, setAssignment] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submissionStatus, setSubmissionStatus] = useState<string>("No entregado")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Buscar la tarea por ID
    const foundAssignment = assignmentsData.find((a) => a.id === params.id)
    if (!foundAssignment) {
      router.push("/dashboard")
      return
    }

    setAssignment(foundAssignment)

    // Cargar comentarios
    setComments(commentsData[params.id as keyof typeof commentsData] || [])

    // Cargar datos guardados en localStorage si existen
    const savedComments = localStorage.getItem(`diclass_comments_${params.id}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }

    const savedSubmissionStatus = localStorage.getItem(`diclass_submission_status_${params.id}`)
    if (savedSubmissionStatus) {
      setSubmissionStatus(savedSubmissionStatus)
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

    // Simular retraso de red
    setTimeout(() => {
      // Crear nuevo comentario
      const newComment = {
        id: Date.now().toString(),
        author: user.name,
        avatar: user.name.substring(0, 2).toUpperCase(),
        date: "Ahora",
        content: comment,
      }

      // Actualizar estado
      const updatedComments = [...comments, newComment]
      setComments(updatedComments)

      // Guardar en localStorage
      localStorage.setItem(`diclass_comments_${params.id}`, JSON.stringify(updatedComments))

      // Mostrar notificación
      toast({
        title: "Comentario enviado",
        description: "Tu comentario ha sido publicado exitosamente",
      })

      // Limpiar campo y estado
      setComment("")
      setSubmitting(false)
    }, 1000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmitAssignment = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un archivo para entregar",
      })
      return
    }

    setSubmitting(true)

    // Simular retraso de red
    setTimeout(() => {
      // Actualizar estado
      setSubmissionStatus("Entregado")

      // Guardar en localStorage
      localStorage.setItem(`diclass_submission_status_${params.id}`, "Entregado")

      // Mostrar notificación
      toast({
        title: "Tarea entregada",
        description: `Tu archivo "${selectedFile.name}" ha sido entregado exitosamente`,
      })

      setSubmitting(false)
    }, 1500)
  }

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
                      <Link href={`/class/${assignment.classId}`} className="text-rose-600 hover:underline">
                        {assignment.class}
                      </Link>
                      <span> • {assignment.teacher}</span>
                    </CardDescription>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" /> Fecha de entrega: {assignment.dueDate}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{assignment.points} pts</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: assignment.details }} />
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Material de referencia:</h3>
                    <div className="flex items-center p-3 border rounded-lg">
                      <FileText className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Material_de_Referencia.pdf</span>
                    </div>
                  </div>
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
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt={comment.author} />
                        <AvatarFallback>{comment.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-sm text-gray-500 ml-2">{comment.date}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
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
            <Card>
              <CardHeader>
                <CardTitle>Tu trabajo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                  <div
                    className="p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer"
                    onClick={handleSelectFile}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      {selectedFile ? selectedFile.name : "Arrastra archivos aquí o haz clic para subir"}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectFile()
                      }}
                    >
                      Seleccionar archivos
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Estado:</span> {submissionStatus}
                    </div>
                    <Button
                      className="bg-rose-600 hover:bg-rose-700"
                      disabled={!selectedFile || submitting || submissionStatus === "Entregado"}
                      onClick={handleSubmitAssignment}
                    >
                      {submitting ? "Entregando..." : "Entregar"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Asignado:</span>
                    <span className="text-sm">10 de mayo, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Fecha de entrega:</span>
                    <span className="text-sm">{assignment.dueDate}</span>
                  </div>
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
    </div>
  )
}
