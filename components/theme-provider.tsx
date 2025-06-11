"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser, updateUserData } from "@/lib/auth"

type Theme = "light" | "dark" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resetTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Intentar obtener el tema del usuario actual
    const currentUser = getCurrentUser()
    if (currentUser && currentUser.theme) {
      setTheme(currentUser.theme as Theme)
    } else {
      // Si no hay tema de usuario, usar el guardado en localStorage
      const savedTheme = localStorage.getItem("diclass_theme") as Theme | null
      if (savedTheme) {
        setTheme(savedTheme)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // Guardar en localStorage como respaldo
    localStorage.setItem("diclass_theme", theme)

    // Guardar en el perfil del usuario si está autenticado
    const currentUser = getCurrentUser()
    if (currentUser) {
      updateUserData({ theme })
    }
  }, [theme, mounted])

  // Función para resetear el tema al cerrar sesión
  const resetTheme = () => {
    setTheme("system")
    localStorage.setItem("diclass_theme", "system")
  }

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
    resetTheme,
  }

  // Evitar el parpadeo durante la hidratación
  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
