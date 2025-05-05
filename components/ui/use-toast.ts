"use client"

// Simplified toast hook for the demo
import { useState } from "react"

type ToastProps = {
  title?: string
  description?: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = ({ title, description, duration = 5000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, duration }

    setToasts((prevToasts) => [...prevToasts, newToast])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, duration)

    // In a real implementation, this would display a toast notification
    console.log(`Toast: ${title} - ${description}`)

    // For demo purposes, we'll use a simple alert
    alert(`${title}\n${description}`)

    return id
  }

  return { toast, toasts }
}
