"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

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

    // Only access localStorage after component is mounted
    try {
      const savedTheme = localStorage.getItem("diclass_theme") as Theme | null
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
        setTheme(savedTheme)
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error)
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

    // Save to localStorage safely
    try {
      localStorage.setItem("diclass_theme", theme)
    } catch (error) {
      console.warn("Could not save theme to localStorage:", error)
    }
  }, [theme, mounted])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  const resetTheme = () => {
    setTheme("system")
    try {
      localStorage.setItem("diclass_theme", "system")
    } catch (error) {
      console.warn("Could not reset theme in localStorage:", error)
    }
  }

  const value = {
    theme,
    setTheme: handleSetTheme,
    resetTheme,
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
