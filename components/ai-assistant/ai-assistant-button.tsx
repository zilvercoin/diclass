"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bot, X } from "lucide-react"
import { AIChat } from "./ai-chat"
import { cn } from "@/lib/utils"

export function AIAssistantButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasNewInfo, setHasNewInfo] = useState(false)

  // Efecto de pulso para llamar la atención
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }, 5000)

    // Verificar si hay tareas o anuncios nuevos
    const checkNewInfo = async () => {
      try {
        // En una implementación real, esto verificaría con el backend
        // Para esta demo, simulamos que hay información nueva
        setHasNewInfo(Math.random() > 0.5)
      } catch (error) {
        console.error("Error checking for new info:", error)
      }
    }

    checkNewInfo()
    const infoInterval = setInterval(checkNewInfo, 60000) // Verificar cada minuto

    return () => {
      clearInterval(interval)
      clearInterval(infoInterval)
    }
  }, [])

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) {
            setHasNewInfo(false) // Resetear indicador al abrir
          }
        }}
        className={cn(
          "fixed bottom-4 right-4 rounded-full shadow-lg z-50 p-3 h-14 w-14 transition-all duration-300",
          isOpen
            ? "bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            : "bg-blue-600 hover:bg-blue-700",
          isAnimating && !isOpen && "scale-110 ring-4 ring-blue-300 dark:ring-blue-900/30",
          hasNewInfo && !isOpen && "animate-bounce",
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        {hasNewInfo && !isOpen && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        )}
      </Button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-full max-w-md animate-in fade-in slide-in-from-right-10 duration-300">
          <AIChat onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  )
}
