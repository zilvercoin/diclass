// Tipos de datos para el asistente de IA
export type AIConversation = {
  id: string
  user_id: string
  user_role: string
  conversation_id: string
  created_at: string
  updated_at: string
}

export type AIMessage = {
  id: string
  conversation_id: string
  role: string
  content: string
  created_at: string
}

export type AIFAQ = {
  id: string
  question: string
  answer: string
  category: string
  for_role: string
  created_at: string
}

export type AIAssistantConfig = {
  id: string
  user_role: string
  model: string
  temperature: number
  max_tokens: number
  system_prompt: string
  created_at: string
  updated_at: string
}

// Funciones para gestionar conversaciones
export function getConversations(): AIConversation[] {
  if (typeof window === "undefined") return []

  const savedConversations = localStorage.getItem("diclass_ai_conversations")
  return savedConversations ? JSON.parse(savedConversations) : []
}

export function getConversationsByUserId(userId: string): AIConversation[] {
  const conversations = getConversations()
  return conversations.filter((c) => c.user_id === userId)
}

export function getConversationById(conversationId: string): AIConversation | null {
  const conversations = getConversations()
  return conversations.find((c) => c.conversation_id === conversationId) || null
}

export function createConversation(data: Omit<AIConversation, "id" | "created_at" | "updated_at">): AIConversation {
  const conversations = getConversations()

  const newConversation: AIConversation = {
    ...data,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const updatedConversations = [...conversations, newConversation]
  localStorage.setItem("diclass_ai_conversations", JSON.stringify(updatedConversations))

  return newConversation
}

export function updateConversation(conversationId: string, data: Partial<AIConversation>): AIConversation | null {
  const conversations = getConversations()
  const index = conversations.findIndex((c) => c.conversation_id === conversationId)

  if (index === -1) return null

  const updatedConversation = {
    ...conversations[index],
    ...data,
    updated_at: new Date().toISOString(),
  }

  conversations[index] = updatedConversation
  localStorage.setItem("diclass_ai_conversations", JSON.stringify(conversations))

  return updatedConversation
}

// Funciones para gestionar mensajes
export function getMessages(): AIMessage[] {
  if (typeof window === "undefined") return []

  const savedMessages = localStorage.getItem("diclass_ai_messages")
  return savedMessages ? JSON.parse(savedMessages) : []
}

export function getMessagesByConversationId(conversationId: string): AIMessage[] {
  const messages = getMessages()
  return messages.filter((m) => m.conversation_id === conversationId)
}

export function createMessage(data: Omit<AIMessage, "id" | "created_at">): AIMessage {
  const messages = getMessages()

  const newMessage: AIMessage = {
    ...data,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  }

  const updatedMessages = [...messages, newMessage]
  localStorage.setItem("diclass_ai_messages", JSON.stringify(updatedMessages))

  return newMessage
}

// Funciones para gestionar FAQs
export function getFAQs(): AIFAQ[] {
  if (typeof window === "undefined") return []

  const savedFAQs = localStorage.getItem("diclass_ai_faqs")
  if (savedFAQs) {
    return JSON.parse(savedFAQs)
  }

  // Si no hay FAQs guardadas, inicializar con datos por defecto
  const defaultFAQs: AIFAQ[] = [
    // FAQs de DiClass
    {
      id: "1",
      question: "¿Cómo puedo unirme a una clase?",
      answer:
        'Para unirte a una clase, ve a tu Dashboard y haz clic en el botón "Unirse a una clase". Luego, ingresa el código de clase proporcionado por tu profesor.',
      category: "Uso de plataforma",
      for_role: "student",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      question: "¿Cómo puedo crear una tarea?",
      answer:
        'Para crear una tarea, ve a la página de tu clase, selecciona la pestaña "Trabajo en clase" y haz clic en el botón "Crear". Completa el formulario con los detalles de la tarea y haz clic en "Crear".',
      category: "Uso de plataforma",
      for_role: "teacher",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      question: "¿Cómo puedo ver mis calificaciones?",
      answer:
        'Para ver tus calificaciones, ve a la página de tu clase y selecciona la pestaña "Calificaciones". Allí verás todas tus tareas calificadas y tu promedio general.',
      category: "Calificaciones",
      for_role: "student",
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      question: "¿Cómo puedo descargar las entregas de mis estudiantes?",
      answer:
        "Para descargar las entregas, ve a la página de la tarea específica y en la sección de entregas de estudiantes, encontrarás los archivos adjuntos que puedes descargar haciendo clic en ellos.",
      category: "Gestión de tareas",
      for_role: "teacher",
      created_at: new Date().toISOString(),
    },
    // FAQs de cultura general
    {
      id: "5",
      question: "¿Cuál es la capital de Francia?",
      answer: "La capital de Francia es París.",
      category: "Cultura General",
      for_role: "both",
      created_at: new Date().toISOString(),
    },
    {
      id: "6",
      question: "¿Quién pintó la Mona Lisa?",
      answer: "La Mona Lisa (o La Gioconda) fue pintada por Leonardo da Vinci entre 1503 y 1519.",
      category: "Cultura General",
      for_role: "both",
      created_at: new Date().toISOString(),
    },
    {
      id: "7",
      question: "¿Cuántos planetas hay en el sistema solar?",
      answer:
        "En nuestro sistema solar hay 8 planetas reconocidos oficialmente: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Plutón fue reclasificado como planeta enano en 2006.",
      category: "Cultura General",
      for_role: "both",
      created_at: new Date().toISOString(),
    },
    {
      id: "8",
      question: "¿Cuál es la montaña más alta del mundo?",
      answer:
        "El Monte Everest es la montaña más alta del mundo, con una altura de 8,848.86 metros sobre el nivel del mar.",
      category: "Cultura General",
      for_role: "both",
      created_at: new Date().toISOString(),
    },
    {
      id: "9",
      question: "¿Quién escribió Don Quijote de la Mancha?",
      answer:
        "Don Quijote de la Mancha fue escrito por Miguel de Cervantes Saavedra y publicado en dos partes, en 1605 y 1615.",
      category: "Cultura General",
      for_role: "both",
      created_at: new Date().toISOString(),
    },
    {
      id: "10",
      question: "¿Cuántos huesos tiene el cuerpo humano?",
      answer: "El cuerpo humano adulto tiene 206 huesos.",
      category: "Cultura General",
      for_role: "both",
      created_at: new Date().toISOString(),
    },
  ]

  localStorage.setItem("diclass_ai_faqs", JSON.stringify(defaultFAQs))
  return defaultFAQs
}

export function getFAQsByRole(role: string): AIFAQ[] {
  const faqs = getFAQs()
  return faqs.filter((f) => f.for_role === role || f.for_role === "both")
}

// Funciones para gestionar configuraciones de asistente
export function getAssistantConfigs(): AIAssistantConfig[] {
  if (typeof window === "undefined") return []

  const savedConfigs = localStorage.getItem("diclass_ai_configs")
  if (savedConfigs) {
    return JSON.parse(savedConfigs)
  }

  // Si no hay configuraciones guardadas, inicializar con datos por defecto
  const defaultConfigs: AIAssistantConfig[] = [
    {
      id: "1",
      user_role: "student",
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 800,
      system_prompt:
        "Eres un asistente educativo amigable diseñado para ayudar a estudiantes. Proporciona explicaciones claras y concisas, enfocándote en resolver dudas académicas y ofrecer orientación sobre el uso de la plataforma DiClass. Evita responder preguntas no relacionadas con temas educativos o la plataforma.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_role: "teacher",
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 1200,
      system_prompt:
        "Eres un asistente educativo avanzado diseñado para profesores. Proporciona respuestas detalladas sobre pedagogía, estrategias de enseñanza, evaluación y uso avanzado de la plataforma DiClass. Puedes ayudar con la creación de materiales didácticos, rúbricas de evaluación y análisis de desempeño estudiantil. Ofrece sugerencias basadas en mejores prácticas educativas.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  localStorage.setItem("diclass_ai_configs", JSON.stringify(defaultConfigs))
  return defaultConfigs
}

export function getAssistantConfigByRole(role: string): AIAssistantConfig | null {
  const configs = getAssistantConfigs()
  return configs.find((c) => c.user_role === role) || null
}

// Inicializar datos
export function initializeAIData(): void {
  if (typeof window === "undefined") return

  // Asegurarse de que existan las configuraciones
  getAssistantConfigs()

  // Asegurarse de que existan las FAQs
  getFAQs()
}
