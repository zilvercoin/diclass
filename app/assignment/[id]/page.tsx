"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, FileText, Upload } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function AssignmentPage({ params }: { params: { id: string } }) {
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    setSubmitting(true)
    // Simulación de envío
    setTimeout(() => {
      setSubmitting(false)
      setComment("")
      // Aquí iría la lógica para enviar el comentario
    }, 1500)
  }

  // Datos simulados de la tarea
  const assignmentData = {
    id: params.id,
    title: "Problemas de Ecuaciones Diferenciales",
    description:
      "Resuelve los siguientes problemas de ecuaciones diferenciales. Muestra todo tu trabajo y explica tu razonamiento para cada paso.",
    dueDate: "18 de mayo, 2024",
    points: "100",
    class: "Matemáticas Avanzadas",
    teacher: "Prof. García",
    status: "Asignado",
  }

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
                    <CardTitle className="text-2xl">{assignmentData.title}</CardTitle>
                    <CardDescription>
                      <Link href={`/class/${assignmentData.id}`} className="text-rose-600 hover:underline">
                        {assignmentData.class}
                      </Link>
                      <span> • {assignmentData.teacher}</span>
                    </CardDescription>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" /> Fecha de entrega: {assignmentData.dueDate}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{assignmentData.points} pts</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <p>{assignmentData.description}</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Resuelve la ecuación diferencial: dy/dx + P(x)y = Q(x)</li>
                      <li>Encuentra la solución general de: y'' - 4y' + 4y = 0</li>
                      <li>Resuelve el problema de valor inicial: y' + 2y = 4, y(0) = 1</li>
                      <li>Encuentra la solución particular de: y'' + y = sin(x)</li>
                      <li>Utiliza el método de variación de parámetros para resolver: y'' + y = sec(x)</li>
                    </ol>
                    <p className="mt-4">
                      Recuerda mostrar todos los pasos de tu solución y explicar tu razonamiento. Las respuestas sin
                      trabajo mostrado no recibirán crédito completo.
                    </p>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Material de referencia:</h3>
                    <div className="flex items-center p-3 border rounded-lg">
                      <FileText className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Apuntes_Ecuaciones_Diferenciales.pdf</span>
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
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@student" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Juan Sánchez</span>
                        <span className="text-sm text-gray-500 ml-2">Hace 2 horas</span>
                      </div>
                      <p className="text-sm">
                        ¿Podemos usar el método de coeficientes indeterminados para el problema 4 en lugar del método de
                        variación de parámetros?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@teacher" />
                      <AvatarFallback>PG</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Prof. García</span>
                        <span className="text-sm text-gray-500 ml-2">Hace 1 hora</span>
                      </div>
                      <p className="text-sm">
                        Sí, Juan. Puedes usar el método de coeficientes indeterminados para el problema 4, ya que la
                        función del lado derecho es sin(x). Para el problema 5, sin embargo, necesitarás usar variación
                        de parámetros debido a la función secante.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start mt-6">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@you" />
                      <AvatarFallback>TÚ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Añadir un comentario a la clase..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button
                        onClick={handleSubmit}
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
                  <div className="p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Arrastra archivos aquí o haz clic para subir</p>
                    <Button variant="outline" size="sm">
                      Seleccionar archivos
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Estado:</span> {assignmentData.status}
                    </div>
                    <Button className="bg-rose-600 hover:bg-rose-700">Entregar</Button>
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
                    <span className="text-sm">{assignmentData.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Puntos:</span>
                    <span className="text-sm">{assignmentData.points}</span>
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
