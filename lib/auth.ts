// Sistema de autenticación mejorado
// En una aplicación real, esto se conectaría a un backend

export type User = {
  id: string
  name: string
  email: string
  role: "student" | "teacher"
  avatar?: string
  password: string // Almacenamos la contraseña para validación (en una app real esto sería hash)
  theme?: "light" | "dark" | "system"
}

// Base de datos simulada de usuarios
let users: User[] = []

// Inicializar usuarios desde localStorage al cargar
if (typeof window !== "undefined") {
  const savedUsers = localStorage.getItem("diclass_users")
  if (savedUsers) {
    users = JSON.parse(savedUsers)
  }
}

// Función para registrar un nuevo usuario
export function registerUser(userData: Omit<User, "id">): User | null {
  // Verificar si el correo ya está registrado
  if (users.some((user) => user.email === userData.email)) {
    return null
  }

  const newUser = {
    ...userData,
    id: Date.now().toString(),
  }

  users.push(newUser)

  // Guardar en localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("diclass_users", JSON.stringify(users))
  }

  return newUser
}

// Función para autenticar un usuario
export function authenticateUser(email: string, password: string): User | null {
  const user = users.find((u) => u.email === email && u.password === password)
  return user || null
}

// Función para obtener el usuario actual desde localStorage
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userJson = localStorage.getItem("diclass_user")
  if (!userJson) return null

  try {
    return JSON.parse(userJson) as User
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

// Función para cerrar sesión
export function logout(): void {
  if (typeof window === "undefined") return

  // Eliminar la información del usuario de localStorage
  localStorage.removeItem("diclass_user")

  // No redirigimos aquí para permitir confirmación
}

// Función para actualizar datos del usuario
export function updateUserData(userData: Partial<User>): void {
  if (typeof window === "undefined") return

  const currentUser = getCurrentUser()
  if (!currentUser) return

  const updatedUser = { ...currentUser, ...userData }
  localStorage.setItem("diclass_user", JSON.stringify(updatedUser))

  // Actualizar también en la "base de datos"
  const userIndex = users.findIndex((u) => u.id === currentUser.id)
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...userData }
    localStorage.setItem("diclass_users", JSON.stringify(users))
  }
}

// Función para obtener todos los usuarios (solo para propósitos de administración)
export function getAllUsers(): User[] {
  return users
}

// Función para obtener un usuario por ID
export function getUserById(id: string): User | null {
  return users.find((u) => u.id === id) || null
}

// Función para obtener un usuario por email
export function getUserByEmail(email: string): User | null {
  return users.find((u) => u.email === email) || null
}

// Sistema de registro de actividades
export type Activity = {
  id: string
  userId: string
  type: "comment" | "submission" | "enrollment" | "creation" | "grade"
  referenceId: string
  referenceName: string
  description: string
  timestamp: string
}

let activities: Activity[] = []

// Inicializar actividades desde localStorage
if (typeof window !== "undefined") {
  const savedActivities = localStorage.getItem("diclass_activities")
  if (savedActivities) {
    activities = JSON.parse(savedActivities)
  }
}

// Función para registrar una nueva actividad
export function recordActivity(activityData: Omit<Activity, "id" | "timestamp">): Activity {
  const newActivity: Activity = {
    ...activityData,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  }

  activities = [newActivity, ...activities]

  // Limitar a las 50 actividades más recientes
  if (activities.length > 50) {
    activities = activities.slice(0, 50)
  }

  // Guardar en localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("diclass_activities", JSON.stringify(activities))
  }

  return newActivity
}

// Función para obtener actividades de un usuario
export function getUserActivities(userId: string, limit = 10): Activity[] {
  return activities
    .filter((activity) => activity.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}
