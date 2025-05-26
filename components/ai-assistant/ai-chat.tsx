"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Bot, User, X, Sparkles, ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { initializeAIData } from "@/lib/ai-storage"
import Link from "next/link"
import { getAssignmentsByClassId, getStudentClasses, getTeacherClasses, getAnnouncementsByClassId } from "@/lib/class"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: Date
  buttons?: {
    text: string
    url: string
    icon?: string
  }[]
}

type AIChatProps = {
  initialMessages?: Message[]
  onClose?: () => void
}

export function AIChat({ initialMessages = [], onClose }: AIChatProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [pendingTasks, setPendingTasks] = useState<any[]>([])
  const [pendingAnnouncements, setPendingAnnouncements] = useState<any[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)

    // Inicializar datos de IA
    initializeAIData()

    // Cargar tareas pendientes
    loadPendingItems(currentUser)

    // Enfocar el input al montar el componente
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Mostrar mensaje de bienvenida personalizado
    const welcomeMessage: Message = {
      id: "welcome-message",
      role: "assistant",
      content: `¡Hola ${currentUser.name}! ¿En qué puedo ayudarte hoy?`,
      createdAt: new Date(),
    }
    setMessages([welcomeMessage])
  }, [router])

  // Función para cargar tareas y anuncios pendientes
  const loadPendingItems = async (currentUser: any) => {
    try {
      // Obtener clases del usuario
      const userClasses =
        currentUser.role === "teacher" ? getTeacherClasses(currentUser.id) : getStudentClasses(currentUser.id)

      // Obtener tareas y anuncios de todas las clases
      let allTasks: any[] = []
      const allAnnouncements: any[] = []

      userClasses.forEach((cls) => {
        const classTasks = getAssignmentsByClassId(cls.id)
        const classAnnouncements = getAnnouncementsByClassId(cls.id)

        // Añadir nombre de clase a cada tarea y anuncio
        classTasks.forEach((task) => {
          allTasks.push({
            ...task,
            className: cls.title,
          })
        })

        classAnnouncements.forEach((announcement) => {
          allAnnouncements.push({
            ...announcement,
            className: cls.title,
          })
        })
      })

      // Filtrar tareas pendientes (para estudiantes)
      if (currentUser.role === "student") {
        // Aquí podrías filtrar por tareas no entregadas o con fecha próxima
        allTasks = allTasks.filter((task) => {
          const dueDate = new Date(task.dueDate)
          return dueDate >= new Date()
        })
      }

      // Ordenar por fecha
      allTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      allAnnouncements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setPendingTasks(allTasks)
      setPendingAnnouncements(allAnnouncements.slice(0, 5)) // Solo los 5 más recientes
    } catch (error) {
      console.error("Error loading pending items:", error)
    }
  }

  useEffect(() => {
    // Scroll al último mensaje
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Verificar si es una pregunta sobre tareas o comunicados
      const lowerInput = input.toLowerCase()
      if (
        lowerInput.includes("tarea") ||
        lowerInput.includes("tareas") ||
        lowerInput.includes("pendiente") ||
        lowerInput.includes("entregar")
      ) {
        // Respuesta sobre tareas pendientes
        handleTasksQuestion()
      } else if (
        lowerInput.includes("comunicado") ||
        lowerInput.includes("anuncio") ||
        lowerInput.includes("noticia") ||
        lowerInput.includes("novedades")
      ) {
        // Respuesta sobre comunicados
        handleAnnouncementsQuestion()
      } else {
        // Otras preguntas - usar la API
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
            conversationId,
            userRole: user.role,
          }),
        })

        if (!response.ok) {
          throw new Error("Error al comunicarse con el asistente")
        }

        const data = await response.json()

        setConversationId(data.conversationId)

        const assistantMessage: Message = {
          id: Date.now().toString() + "-assistant",
          role: "assistant",
          content: data.response,
          createdAt: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error:", error)

      // Mensaje de error
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.",
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Función para manejar preguntas sobre tareas
  const handleTasksQuestion = () => {
    let content = ""
    const buttons: { text: string; url: string; icon?: string }[] = []

    if (pendingTasks.length === 0) {
      content = "¡Buenas noticias! No tienes tareas pendientes en este momento."
    } else {
      content = `Tienes ${pendingTasks.length} tarea${pendingTasks.length > 1 ? "s" : ""} pendiente${pendingTasks.length > 1 ? "s" : ""}:\n\n`

      pendingTasks.forEach((task, index) => {
        const dueDate = new Date(task.dueDate)
        const formattedDate = dueDate.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
        })

        content += `${index + 1}. **${task.title}** (${task.className}) - Entrega: ${formattedDate}\n`

        // Añadir botón para cada tarea
        buttons.push({
          text: `Ver tarea: ${task.title}`,
          url: `/assignment/${task.id}`,
          icon: "FileText",
        })
      })
    }

    const assistantMessage: Message = {
      id: Date.now().toString() + "-assistant",
      role: "assistant",
      content: content,
      createdAt: new Date(),
      buttons: buttons,
    }

    setMessages((prev) => [...prev, assistantMessage])
  }

  // Función para manejar preguntas sobre comunicados
  const handleAnnouncementsQuestion = () => {
    let content = ""
    const buttons: { text: string; url: string; icon?: string }[] = []

    if (pendingAnnouncements.length === 0) {
      content = "No hay comunicados o anuncios recientes en tus clases."
    } else {
      content = `Aquí están los comunicados más recientes:\n\n`

      pendingAnnouncements.forEach((announcement, index) => {
        const date = new Date(announcement.createdAt)
        const formattedDate = date.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
        })

        const shortContent =
          announcement.content.length > 50 ? announcement.content.substring(0, 50) + "..." : announcement.content

        content += `${index + 1}. **${announcement.className}** (${formattedDate}): ${shortContent}\n`

        // Añadir botón para cada anuncio
        buttons.push({
          text: `Ver clase: ${announcement.className}`,
          url: `/class/${announcement.classId}`,
          icon: "MessageSquare",
        })
      })
    }

    const assistantMessage: Message = {
      id: Date.now().toString() + "-assistant",
      role: "assistant",
      content: content,
      createdAt: new Date(),
      buttons: buttons,
    }

    setMessages((prev) => [...prev, assistantMessage])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFeedback = async (messageId: string, isPositive: boolean) => {
    // Implementar lógica para guardar feedback
    try {
      await fetch("/api/ai/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          isPositive,
          conversationId,
        }),
      })
    } catch (error) {
      console.error("Error al enviar feedback:", error)
    }
  }

  // Componente para renderizar botones en los mensajes
  const MessageButtons = ({ buttons }: { buttons?: { text: string; url: string; icon?: string }[] }) => {
    if (!buttons || buttons.length === 0) return null

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {buttons.map((button, index) => (
          <Link href={button.url} key={index}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {button.icon === "FileText" && <FileText className="h-3 w-3" />}
              {button.icon === "MessageSquare" && <MessageSquare className="h-3 w-3" />}
              {button.icon === "ExternalLink" && <ExternalLink className="h-3 w-3" />}
              <span className="text-xs">{button.text}</span>
            </Button>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-rose-100 dark:border-rose-900/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 bg-rose-100 dark:bg-rose-900/20">
            <AvatarFallback className="text-rose-600">
              <Bot size={16} />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg font-semibold">
            {user?.role === "teacher" ? "Asistente Avanzado" : "Asistente DiClass"}
          </CardTitle>
          {user?.role === "teacher" && (
            <span className="bg-rose-100 text-rose-600 text-xs px-2 py-1 rounded-full dark:bg-rose-900/20">
              <Sparkles size={12} className="inline mr-1" /> Pro
            </span>
          )}
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X size={16} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[350px] p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-3">
              <Bot size={40} className="text-rose-600" />
              <h3 className="font-semibold text-lg">¿En qué puedo ayudarte hoy?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.role === "teacher"
                  ? "Pregúntame sobre estrategias de enseñanza, evaluación o uso avanzado de DiClass."
                  : "Pregúntame sobre tus tareas, clases o cómo usar DiClass."}
              </p>

              {/* Sugerencias de preguntas */}
              <div className="mt-4 space-y-2 w-full">
                <p className="text-sm font-medium">Prueba preguntar:</p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => {
                      setInput("¿Tengo tareas pendientes?")
                      setTimeout(() => {
                        if (inputRef.current) inputRef.current.focus()
                      }, 100)
                    }}
                    className="text-sm text-left px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    ¿Tengo tareas pendientes?
                  </button>
                  <button
                    onClick={() => {
                      setInput("¿Hay comunicados nuevos?")
                      setTimeout(() => {
                        if (inputRef.current) inputRef.current.focus()
                      }, 100)
                    }}
                    className="text-sm text-left px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    ¿Hay comunicados nuevos?
                  </button>
                  <button
                    onClick={() => {
                      setInput("Resuelve 3x + 5 = 20")
                      setTimeout(() => {
                        if (inputRef.current) inputRef.current.focus()
                      }, 100)
                    }}
                    className="text-sm text-left px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    Resuelve 3x + 5 = 20
                  </button>
                  <button
                    onClick={() => {
                      setInput("¿Quiénes fueron los aztecas?")
                      setTimeout(() => {
                        if (inputRef.current) inputRef.current.focus()
                      }, 100)
                    }}
                    className="text-sm text-left px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    ¿Quiénes fueron los aztecas?
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                    message.role === "user" ? "ml-auto bg-rose-600 text-white" : "bg-muted",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    <span className="font-semibold">{message.role === "assistant" ? "Asistente" : "Tú"}</span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-full">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>

                  {/* Botones de acción en el mensaje */}
                  {message.role === "assistant" && message.buttons && <MessageButtons buttons={message.buttons} />}

                  {message.role === "assistant" && (
                    <div className="flex items-center gap-1 self-end mt-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20"
                        onClick={() => handleFeedback(message.id, true)}
                      >
                        <ThumbsUp size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
                        onClick={() => handleFeedback(message.id, false)}
                      >
                        <ThumbsDown size={12} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="font-semibold">Asistente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Pensando...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <div className="flex w-full items-center space-x-2">
          <Input
            ref={inputRef}
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-rose-600 hover:bg-rose-700"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Componente para el icono de MessageSquare
function MessageSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

// Componente para el icono de FileText
function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}
