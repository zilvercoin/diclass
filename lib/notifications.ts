export type Notification = {
  id: string
  userId: string
  title: string
  message: string
  link?: string
  createdAt: string
  read: boolean
  type: "assignment" | "submission" | "comment" | "grade" | "system"
  referenceId?: string
}

let notifications: Notification[] = []

// Inicializar notificaciones desde localStorage
if (typeof window !== "undefined") {
  const savedNotifications = localStorage.getItem("diclass_notifications")
  if (savedNotifications) {
    notifications = JSON.parse(savedNotifications)
  }
}

// Función para crear una nueva notificación
export function createNotification(data: Omit<Notification, "id" | "createdAt" | "read">): Notification {
  const newNotification: Notification = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    read: false,
  }

  notifications = [newNotification, ...notifications]

  // Guardar en localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("diclass_notifications", JSON.stringify(notifications))
  }

  return newNotification
}

// Función para obtener notificaciones de un usuario
export function getUserNotifications(userId: string): Notification[] {
  return notifications.filter((n) => n.userId === userId)
}

// Función para obtener notificaciones no leídas de un usuario
export function getUnreadNotifications(userId: string): Notification[] {
  return notifications.filter((n) => n.userId === userId && !n.read)
}

// Función para marcar una notificación como leída
export function markNotificationAsRead(notificationId: string): boolean {
  const notificationIndex = notifications.findIndex((n) => n.id === notificationId)
  if (notificationIndex === -1) return false

  notifications[notificationIndex].read = true

  // Guardar en localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("diclass_notifications", JSON.stringify(notifications))
  }

  return true
}

// Función para marcar todas las notificaciones de un usuario como leídas
export function markAllNotificationsAsRead(userId: string): boolean {
  let updated = false
  notifications = notifications.map((n) => {
    if (n.userId === userId && !n.read) {
      updated = true
      return { ...n, read: true }
    }
    return n
  })

  // Guardar en localStorage si hubo cambios
  if (updated && typeof window !== "undefined") {
    localStorage.setItem("diclass_notifications", JSON.stringify(notifications))
  }

  return updated
}

// Función para eliminar una notificación
export function deleteNotification(notificationId: string): boolean {
  const initialLength = notifications.length
  notifications = notifications.filter((n) => n.id !== notificationId)

  // Guardar en localStorage si hubo cambios
  if (notifications.length !== initialLength && typeof window !== "undefined") {
    localStorage.setItem("diclass_notifications", JSON.stringify(notifications))
  }

  return notifications.length !== initialLength
}

// Función para notificar sobre una nueva tarea
export function notifyNewAssignment(
  assignmentId: string,
  assignmentTitle: string,
  classId: string,
  className: string,
  studentIds: string[],
): void {
  studentIds.forEach((studentId) => {
    createNotification({
      userId: studentId,
      title: "Nueva tarea asignada",
      message: `Se ha publicado una nueva tarea: "${assignmentTitle}" en la clase "${className}"`,
      link: `/assignment/${assignmentId}`,
      type: "assignment",
      referenceId: assignmentId,
    })
  })
}

// Función para notificar sobre una entrega de tarea
export function notifySubmission(
  assignmentId: string,
  assignmentTitle: string,
  studentId: string,
  studentName: string,
  teacherId: string,
): void {
  createNotification({
    userId: teacherId,
    title: "Nueva entrega de tarea",
    message: `${studentName} ha entregado la tarea "${assignmentTitle}"`,
    link: `/assignment/${assignmentId}`,
    type: "submission",
    referenceId: assignmentId,
  })
}

// Función para notificar sobre un comentario
export function notifyComment(
  commentType: "assignment" | "announcement",
  referenceId: string,
  title: string,
  authorId: string,
  authorName: string,
  recipientIds: string[],
): void {
  const link = commentType === "assignment" ? `/assignment/${referenceId}` : `/class/${referenceId}`

  recipientIds.forEach((recipientId) => {
    if (recipientId !== authorId) {
      createNotification({
        userId: recipientId,
        title: "Nuevo comentario",
        message: `${authorName} ha comentado en "${title}"`,
        link,
        type: "comment",
        referenceId,
      })
    }
  })
}

// Función para notificar sobre una calificación
export function notifyGrade(assignmentId: string, assignmentTitle: string, studentId: string, grade: string): void {
  createNotification({
    userId: studentId,
    title: "Tarea calificada",
    message: `Tu tarea "${assignmentTitle}" ha sido calificada con ${grade} puntos`,
    link: `/assignment/${assignmentId}`,
    type: "grade",
    referenceId: assignmentId,
  })
}

// Función para calcular el tiempo restante para una tarea
export function getRemainingTime(dueDate: string, dueTime?: string): string {
  const now = new Date()
  const deadline = new Date(`${dueDate}T${dueTime || "23:59"}:00`)

  const diffMs = deadline.getTime() - now.getTime()
  if (diffMs <= 0) return "Vencida"

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (diffDays > 0) {
    return `${diffDays} día${diffDays > 1 ? "s" : ""} y ${diffHours} hora${diffHours > 1 ? "s" : ""}`
  } else if (diffHours > 0) {
    return `${diffHours} hora${diffHours > 1 ? "s" : ""}`
  } else {
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`
  }
}
