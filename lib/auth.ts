// Simulación de un sistema de autenticación
// En una aplicación real, esto se conectaría a un backend

export type User = {
  id: string
  name: string
  email: string
  role: "student" | "teacher"
  avatar?: string
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
  localStorage.removeItem("diclass_user")
  window.location.href = "/login"
}

// Función para actualizar datos del usuario
export function updateUserData(userData: Partial<User>): void {
  if (typeof window === "undefined") return

  const currentUser = getCurrentUser()
  if (!currentUser) return

  const updatedUser = { ...currentUser, ...userData }
  localStorage.setItem("diclass_user", JSON.stringify(updatedUser))
}
